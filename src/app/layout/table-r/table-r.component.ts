import {ChangeDetectionStrategy, Component, Input, SimpleChanges, ViewChild, inject, signal} from '@angular/core';
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
    private router: Router,) { }
  
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['id_status'] && this.document.length > 0) {
      this.applyFilter();
    }
  }

  ngOnInit(): void {
    this.isLoading = true;
    this.dataService.getDocuments().subscribe({ 
      next: (document) => {
        this.dataSource.data = document.documents;
        console.log(this.dataSource.data);
        this.isLoading = true;
      },
      error: (error) => {
      }
    });
  }

  applyFilter(): void {
    if (this.id_status) {
      const params = {
        status: this.id_status
      };
      console.log(this.id_status);
      this.uda.filters(params).subscribe({
        next: (response) => {
          console.log(response);
          this.dataSource.data = response.documents;
          // Puedes actualizar this.document o this.dataSource aquí si quieres
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