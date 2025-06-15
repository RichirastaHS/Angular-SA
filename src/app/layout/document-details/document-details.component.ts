import { SafeResourceUrl } from '@angular/platform-browser';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { DataService } from '../../service/data.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ApiResponse, Document } from '../../models/document';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../service/notification.service';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MatDialogTitle,
  MatDialogContent,
  MatDialogActions,
  MatDialogClose,
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialog,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TableRComponent, DialogData } from '../table-r/table-r.component';
import { TimeService } from '../../service/time.service';
import { UdaService } from '../../service/uda.service';
import { ChangestatusComponent } from '../changestatus/changestatus.component';
import { DHistoryChangesComponent } from '../d-history-changes/d-history-changes.component';
import { DFilesComponent } from '../d-files/d-files.component';
import { DocumentDataHistory } from '../../models/docdatahistory';
import { Comment } from '../../models/comment';

export interface FileData {
  id: number;
  document_id: string;
  original_name: string;
  stored_name: string;
  file_extension: string;
  file_path: string;
  file_url: string;
  mime_type: string;
  file_size: number;
  uploaded_by: number;
  uploaded_at: string;
  created_at: string;
  updated_at: string;
}

@Component({
  selector: 'app-document-details',
  imports: [
    CommonModule,
    RouterLink,
    ReactiveFormsModule,
    ChangestatusComponent,
    DHistoryChangesComponent,
    DFilesComponent,
  ],
  templateUrl: './document-details.component.html',
  styleUrl: './document-details.component.css',
})
export class DocumentDetailsComponent {
  commentForm = new FormGroup({
    comment: new FormControl('', { nonNullable: true }),
  });
  postingComment = false;

  readonly dialog = inject(MatDialog);
  safeUrl: SafeResourceUrl = '';
  idDoc: string = '';
  section: string = 'archivos';
  coments: Comment[] = [];
  document!: Document;
  files: FileData[] = [];
  DocumentDataHistory: DocumentDataHistory[] = [];
  permissions = {
    create: false,
    read: false,
    update: false,
    delete: false,
  };
  constructor(
    private route: ActivatedRoute,
    private dataService: DataService,
    private NotificationService: NotificationService,
    private router: Router,
    private time: TimeService,
    public udaService: UdaService // Inyectar UdaService para comentarios
  ) {}
  previewisvisible: boolean = false;
  documentisEdit: boolean = false;

  ngOnInit(): void {
    this.loadPermissions();
    this.idDoc = this.route.snapshot.paramMap.get('id')!; // Obtiene el id del documento
    if (this.idDoc) {
      this.dataService.getDocumentbyId(this.idDoc).subscribe({
        next: (response) => {
          console.log(response);
          const doc = response.document as Document;
          this.document = {
            ...doc,
            issue_date: this.time.formatFullDate(doc.issue_date),
            received_date: this.time.formatFullDate(doc.received_date),
            created_at: this.time.formatFullDate(doc.created_at),
            updated_at: doc.updated_at
              ? this.time.formatFullDate(doc.updated_at)
              : null,
          };
          this.coments = (response.comments as any[]).map(
            (c: any): Comment => ({
              ...c,
              id: Number(c.id),
              created_at: this.time.getRelativeTime(c.created_at),
              updated_at: c.updated_at
                ? this.time.getRelativeTime(c.updated_at)
                : null,
            })
          );
          this.files = response.document.files;
        },
        error: (error) => {
          this.router.navigate(['/main']);
          this.NotificationService.showError(
            error.error.message,
            error.error.message
          );
        },
      });
    }
  }

  loadPermissions(): void {
    try {
      const storedPermissions = localStorage.getItem('permissions');
      if (storedPermissions) {
        this.permissions = JSON.parse(storedPermissions);
      }
    } catch (error) {
      // Fallback to default permissions if there's an error
      this.permissions = {
        create: false,
        read: false,
        update: false,
        delete: false,
      };
    }
  }
  deletedoc() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.dataService.deleteDocument(id).subscribe({
        next: (response: ApiResponse) => {
          this.router.navigate(['/main']);
          this.NotificationService.showSuccess(
            'Documento borrado con exito',
            `El documento ${id} fue borrado`
          ); // Muestra la notificación de éxito
        },
        error: (error) => {
          this.router.navigate(['/main']);
          this.NotificationService.showSuccess(
            'No tienes permiso para hacer esto',
            error
          );
        },
      });
    }
  }
  changestatusopen = false;
  
  changestatus() {
    this.changestatusopen = true;
  }

  getHistory() {
    this.section = 'historial';
    this.dataService.getDocumentHistory(this.idDoc).subscribe({
      next: (response) => {
        this.DocumentDataHistory = response.data;
        console.log(this.DocumentDataHistory);
      },
    });
  }

  postComment() {
    if (this.commentForm.invalid || this.postingComment) return;
    this.postingComment = true;
    const commentText = this.commentForm.get('comment')?.value?.trim();
    if (!commentText) {
      this.NotificationService.showError(
        'El comentario no puede estar vacío',
        'Error'
      );
      this.postingComment = false;
      return;
    }
    const payload = {
      document_id: this.idDoc,
      comment: commentText,
    };
    this.udaService.postComment(payload).subscribe({
      next: (resp: any) => {
        this.NotificationService.showSuccess('Comentario agregado', 'Éxito');
        this.commentForm.reset();
        this.refreshComments();
        this.postingComment = false;
      },
      error: (err: any) => {
        this.NotificationService.showError(
          'Error al agregar comentario',
          err?.error?.message || ''
        );
        this.postingComment = false;
      },
    });
  }

  deleteComment(commentId: string) {
    if (!commentId) return;
    this.udaService.deleteComment(Number(commentId)).subscribe({
      next: () => {
        this.NotificationService.showSuccess('Comentario eliminado', 'Éxito');
        this.refreshComments();
      },
      error: (err: any) => {
        this.NotificationService.showError(
          'Error al eliminar comentario',
          err?.error?.message || ''
        );
      },
    });
  }

  refreshComments() {
    if (this.idDoc) {
      this.dataService.getDocumentbyId(this.idDoc).subscribe({
        next: (response) => {
          this.coments = response.comments.map((c: any) => ({
            ...c,
            id: Number(c.id),
          }));
        },
      });
    }
  }
  cerrarModal() {
    this.changestatusopen = false;
  }
  openDialog(): void {
    const dialogRef = this.dialog.open(DialogContentExampleDialog, {});
    dialogRef.afterClosed().subscribe((result) => {
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
