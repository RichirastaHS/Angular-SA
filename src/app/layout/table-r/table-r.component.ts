import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output, SimpleChanges, ViewChild, inject, signal} from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
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
import { UdaService } from '../../service/uda.service';
import * as ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { ExcelExportService } from '../../service/excel-export.service';


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
    MatPaginatorModule, 
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
  @Input() id_status?: number;
  @Output() exportExcel = new EventEmitter<void>();
  readonly id = signal('');
  isLoading = false;
  columnsToDisplay  = ['Nombre', 'Tipo', 'Fecha de recepción', 'Fecha de registro', 'Estatus', 'Acciones'];
  document: Document[] = [];
  dataSource = new MatTableDataSource<Document>();

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
    private uda : UdaService,
    private dataService: DataService, 
    private NotificationService: NotificationService,
    private excelExportService: ExcelExportService,
    ) {
      this.excelExportService.exportRequested$.subscribe(() => {
      this.exportToExcel();});
     }
  
  ngOnChanges(changes: SimpleChanges): void {
    console.log(this.id_status);
    if (changes['id_status'] && changes['id_status'].currentValue != null) {
      this.applyFilter();
    }
  }

  ngOnInit(): void {
    this.isLoading = true;
    this.dataService.getDocuments().subscribe({ 
      next: (document) => {
        this.dataSource.data = document.documents;
        this.document = document.documents;
        this.isLoading = true;
      },
      error: (error) => {
      }
    });
  }

  applyFilter(): void {
    console.log(this.id_status);
    if (this.id_status) {
      const params = {
        status: this.id_status
      };

      this.uda.filters(params).subscribe({
        next: (response) => {
          console.log(response);
          this.dataSource.data = response.documents;
        },
        error: (error) => {
          console.error(error);
        }
      });
    }
    else{
      this.dataService.getDocuments().subscribe({ 
        next: (document) => {
            this.dataSource.data = document.documents;
            this.isLoading = true; 
        },
        error: (error) => {
        }
      });
    }

  }

  deletedoc(id: string): void {
        this.dataService.deleteDocument(id).subscribe({  
          next: (response: ApiResponse) => {
            this.dataSource.data = this.dataSource.data.filter(doc => doc.id !== id);
            this.NotificationService.showSuccess('Documento borrado con exito', `El documento con ${id} fue borrado`); // Muestra la notificación de éxito
          },
          error: (error) => {
            console.log(error); 
          }
        });
    }

  @ViewChild(MatPaginator)
  paginator: MatPaginator = new MatPaginator;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  exportToExcel(): void {
    // Crear un nuevo libro de trabajo
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Documentos');

    // Agregar encabezados
    const headers = [
      'ID',
      'Título',
      'Número de referencia',
      'Descripción',
      'Categoría',
      'Estatus',
      'Departamento remitente',
      'Departamento receptor',
      'Fecha de emisión',
      'Fecha de recepción',
      'Prioridad',
      'Creado por',
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
        doc.id,
        doc.title,
        doc.reference_number,
        doc.description,
        doc.category.name,
        doc.status.name,
        doc.sender_department.name,
        doc.receiver_department.name,
        doc.issue_date,
        doc.received_date,
        doc.priority,
        doc.created_at
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