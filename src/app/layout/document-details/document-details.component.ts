import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { DataService } from '../../service/data.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ApiResponse, Document } from '../../models/document';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../service/notification.service';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogClose, MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TableRComponent, DialogData } from '../table-r/table-r.component';

@Component({
  selector: 'app-document-details',
  imports: [CommonModule, RouterLink],
  templateUrl: './document-details.component.html',
  styleUrl: './document-details.component.css'
})

export class DocumentDetailsComponent {
  readonly dialog = inject(MatDialog);
  
  document!: Document;

  constructor(
    private route: ActivatedRoute,
    private dataService: DataService,
    private NotificationService: NotificationService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id'); // Obtiene el id del documento
    if(id){
      this.dataService.getDocumentbyId(id).subscribe({  
        next: (response: ApiResponse) => {
          this.document = response.document; 
        },
        error: (error) => {
          this.router.navigate(['/main']);
          this.NotificationService.showError(error.error.message, error.error.message);
        }
      });
    }
  }

  deletedoc(){
    const id = this.route.snapshot.paramMap.get('id');
    if(id){
      this.dataService.deleteDocument(id).subscribe({  
        next: (response: ApiResponse) => {
          this.router.navigate(['/main']);
            this.NotificationService.showSuccess('Documento borrado con exito', `El documento ${id} fue borrado`); // Muestra la notificación de éxito
        },
        error: (error) => {
          this.router.navigate(['/main']);
          this.NotificationService.showSuccess("No tienes permiso para hacer esto", error);
        }
      });
    }
  }
  openDialog(): void{
      const dialogRef = this.dialog.open(DialogContentExampleDialog, {
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.deletedoc();
        }
      });
    }
}

@Component({
  selector: 'dialog-content-example-dialog',
  templateUrl: 'dialog-content-dialog.html',
  styleUrl: 'dialog-content-dialog.css',
  imports: [MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialogContentExampleDialog {
  readonly dialogRef = inject(MatDialogRef<TableRComponent>);
  readonly data = inject<DialogData>(MAT_DIALOG_DATA);

  eliminar(id: string): void {
    this.dialogRef.close(id);
  }
}