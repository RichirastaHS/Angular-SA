import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output, SimpleChanges, ViewChild, inject, signal} from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatSelectModule} from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { DataService } from '../../service/data.service';
import { ApiResponse, Document } from '../../models/document';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { NotificationService } from '../../service/notification.service';
import {MAT_DIALOG_DATA, MatDialog, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogModule, MatDialogRef, MatDialogTitle} from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import * as ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { ExcelExportService } from '../../service/excel-export.service';
import { TimeService } from '../../service/time.service';

export interface DialogData {
  id: string;
}

export interface filter {
  type: string,
  id: number
}

@Component({
  selector: 'app-table-r',
  imports: [
    RouterLink, 
    MatSelectModule,
    CommonModule, 
    MatTableModule, 
    MatButtonModule, 
    MatProgressSpinnerModule,
    MatFormFieldModule, 
    MatInputModule, 
    FormsModule, 
    MatButtonModule
  ],
  templateUrl: './table-r.component.html',
  styleUrl: './table-r.component.css'
})


export class TableRComponent {
  @Input() id_status?: number = 0;
  @Input() filtros: { category_id: string, start_date: string, end_date: string } = {
  category_id: '',
  start_date: '',
  end_date: ''
  };

  @Output() exportExcel = new EventEmitter<void>();
  readonly id = signal('');
  isLoading = false;
  columnsToDisplay  = ['Nombre', 'Tipo', 'Fecha de recepción', 'Fecha de registro', 'Estatus', 'Acciones'];
  document: Document[] = [];
  dataSource = new MatTableDataSource<Document>();
  pgtotal = 0;
  currentPage = 1;
  lastPage = 0;
  statusid = 0;
  permissions = {
    create: false,
    read: false,
    update: false,
    delete: false
  };
  readonly dialog = inject(MatDialog);

  openDialog(id_doc:string): void{
    const dialogRef = this.dialog.open(DialogContentExampleDialog, {
      data: {id: id_doc}
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.deletedoc(result);
      }
    });
  }

  constructor(
    private dataService: DataService, 
    private NotificationService: NotificationService,
    private excelExportService: ExcelExportService,
    private time: TimeService,
    ) {
      this.excelExportService.exportRequested$.subscribe(() => {
      this.exportToExcel();});
     }
  
  ngOnChanges(changes: SimpleChanges): void {
    this.currentPage = 0;
    this.applyFilter();
  }  

  ngOnInit(): void {
    this.isLoading = true;
    this.loadPermissions();
  }
  loadPermissions(): void {
      try {
        const storedPermissions = localStorage.getItem('permissions');
        if (storedPermissions) {
          this.permissions = JSON.parse(storedPermissions);
        }
      } catch (error) {

        this.permissions = {
          create: false,
          read: false,
          update: false,
          delete: false
        };
    }
  }

  getDocs(page?:number): void {
  this.isLoading = true;
  
  this.dataService.getDocuments(
    {
      page: page,
      per_page: 10,
      status_id:  this.statusid,
      category_id: Number(this.filtros.category_id) || 0,
      start_date: this.filtros.start_date || '',
      end_date: this.filtros.end_date || ''
    }
  ).subscribe({
    next: (response) => {
      this.dataSource.data = (response.documents as Document[]).map((doc: Document) => ({
    ...doc,
      issue_date: this.time.formatFullDate(doc.issue_date),
      received_date: this.time.formatFullDate(doc.received_date),
      created_at: this.time.formatFullDate(doc.created_at),
      updated_at: doc.updated_at ? this.time.formatFullDate(doc.updated_at) : null,
    }));
      this.pgtotal = response.pagination.total;
      this.currentPage = response.pagination.current_page;
      this.lastPage = response.pagination.last_page;
    },
    error: (error) => {
      this.isLoading = false;
      this.NotificationService.showError('Error al obtener los documentos', error.message);
     }
  });
  }
  getPagesArray(): number[] {
  const totalPages = this.lastPage;
  const current = this.currentPage;
  const range = 4;
  const pages: number[] = [];

  // Lógica para generar el rango de páginas
  for (let i = Math.max(1, current - range); i <= Math.min(totalPages, current + range); i++) {
    pages.push(i);
  }

  return pages;
}

  applyFilter(): void {
    this.statusid = this.id_status ?? 0;
    this.getDocs(this.currentPage);
  }

  deletedoc(id: string): void {
  this.dataService.deleteDocument(id).subscribe({  
    next: (response: ApiResponse) => {
      this.dataSource.data = this.dataSource.data.filter(doc => doc.id !== id);
      this.NotificationService.showSuccess('Documento borrado con exito', `El documento con ${id} fue borrado`); // Muestra la notificación de éxito
    },
    error: (error) => {
    }        
  });      
  }

  exportToExcel(): void {
    // Crear un nuevo libro de trabajo
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Documentos');

    // Agregar encabezados
    const headers = [
      'Título',
      'Número de referencia',
      'Descripción',
      'Categoría',
      'Estatus',
      'Departamento remitente',
      'Departamento receptor',
      'Fecha de emisión',
      'Fecha de creación'
    ];
    
    worksheet.addRow(headers);

    // Estilo para los encabezados
    const headerRow = worksheet.getRow(1);
    headerRow.eachCell((cell) => {
      cell.font = { bold: true };
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFD3D3D3' }
      };
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
      };
    });

    // Agregar datos
    this.document.forEach(doc => {
      const row = [
        doc.title,
        doc.reference_number,
        doc.description,
        doc.category.name,
        doc.status.name,
        doc.sender_department.name,
        doc.receiver_department.name,
        doc.received_date,
        doc.priority,
      ];
      
      worksheet.addRow(row);
    });

    // Ajustar el ancho de las columnas automáticamente
    worksheet.columns.forEach(column => {
      if (column && column.eachCell) { // Verificamos que exista
      let maxLength = 0;
      column.eachCell({ includeEmpty: true }, cell => {
        const columnLength = cell.value ? cell.value.toString().length : 10;
        if (columnLength > maxLength) {
          maxLength = columnLength;
        }
      });
      column.width = maxLength < 10 ? 10 : maxLength + 2;
    }
    });

    // Generar el archivo Excel
    workbook.xlsx.writeBuffer().then((buffer: ExcelJS.Buffer) => {
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      saveAs(blob, `documentos_${new Date().toISOString().slice(0,10)}.xlsx`);
    });
  }
}

@Component({
  selector: 'dialog-content-example-dialog',
  templateUrl: 'dialog-content-dialog.html',
  styleUrl: 'dialog-content-dialog.css',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialogContentExampleDialog {
  readonly dialogRef = inject(MatDialogRef<TableRComponent>);
  readonly data = inject<DialogData>(MAT_DIALOG_DATA);

  eliminar(id: string): void {
    this.dialogRef.close(id);
}
}