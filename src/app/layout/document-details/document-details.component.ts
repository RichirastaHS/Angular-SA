import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { DataService } from '../../service/data.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ApiResponse, Document } from '../../models/document';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../service/notification.service';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogClose, MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TableRComponent, DialogData } from '../table-r/table-r.component';

export interface Comment {
  id: string;
  text: string;
  created_at: string;
  name: string;
}
interface ArchivoSubido {
  id: number;       // Identificador único (puede ser un timestamp o un UUID)
  nombre: string;   // Nombre del archivo (ej: "documento.pdf")
  tipo: string;     // Tipo MIME (ej: "application/pdf")
  tamaño: number;   // Tamaño en bytes
  file: File;       // Objeto File original (opcional, si necesitas enviarlo luego)
}
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
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './document-details.component.html',
  styleUrl: './document-details.component.css'
})

export class DocumentDetailsComponent {
  readonly dialog = inject(MatDialog);
  safeUrl: SafeResourceUrl="";
  idDoc: string="";
  coments: Comment[]= [];
  files: FileData[] = [];
  document!: Document;
  archivosSubidos: ArchivoSubido[] = [];
  FileArray: File[] = []; 
  permissions = {
    create: false,
    read: false,
    update: false,
    delete: false
  };
  constructor(
    private route: ActivatedRoute,
    private dataService: DataService,
    private NotificationService: NotificationService,
    private router: Router,
    private sanitizer: DomSanitizer,
  ) {}
  previewisvisible: boolean = false;
  documentisEdit: boolean = false;
  filesform = new FormGroup({
      files: new FormControl<File[] | null>([])
  });

  ngOnInit(): void {
    this.loadPermissions();
    this.idDoc = this.route.snapshot.paramMap.get('id')!; // Obtiene el id del documento
    if(this.idDoc){
      this.dataService.getDocumentbyId(this.idDoc).subscribe({  
        next: (response) => {
          console.log(response);
          this.document = response.document; 
          this.coments = response.comments;
          this.files = response.document.files;
        },
        error: (error) => {
          this.router.navigate(['/main']);
          this.NotificationService.showError(error.error.message, error.error.message);
        }
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
        console.error('Error loading permissions:', error);
        // Fallback to default permissions if there's an error
        this.permissions = {
          create: false,
          read: false,
          update: false,
          delete: false
        };
    }
  }

  descargafile(idarchivo: number){
    this.dataService.downloadDocFile(this.idDoc, idarchivo).subscribe({
      next:(value) =>{
          console.log(value);
      },
      error:(err)=>{
          console.log(err);
      },
    });
  }

  previewfile(idarchivo: number){
    this.dataService.previewDocFile(this.idDoc, idarchivo).subscribe({
      next:(value) =>{
          console.log(value);
          const url = value.file_url
          this.safeUrl =  this.sanitizer.bypassSecurityTrustResourceUrl(url);
          this.previewisvisible = true;
      },
      error:(err) =>{
          console.log(err);
      },
    });
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


  onFileArraySelected(event: Event) {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files.length > 0) {
    const file = input.files[0];

    const extension = file.name.split('.').pop()?.toLowerCase();
    const extensionesPermitidas = ['pdf', 'xlsx', 'docx'];
    if (!extension || !extensionesPermitidas.includes(extension)) {
      this.NotificationService.showError(
        'Formato incorrecto',
        'Solo se permiten archivos PDF, XLSX o DOCX'
      );
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      this.NotificationService.showError(
        'Archivo demasiado grande',
        'El tamaño máximo permitido es 5MB'
      );
      return;
    }

    const nuevoArchivo: ArchivoSubido = {
      id: Date.now(),
      nombre: file.name,
      tipo: extension,
      tamaño: file.size,
      file: file
    };

    this.archivosSubidos.push(nuevoArchivo);
    this.FileArray.push(nuevoArchivo.file);

    // 🔽 Actualiza el valor del FormControl en el formulario reactivo
    this.filesform.patchValue({
      files: this.FileArray
    });
  }
  }
  eliminarArchivo(id: number) {
    this.archivosSubidos = this.archivosSubidos.filter(archivo => archivo.id !== id);
  }
  closePreview(){
    this.previewisvisible = false;
  }
  onSubmit() {
    const formData = new FormData();
    const archivos = this.filesform.get('files')?.value;
    if (archivos && Array.isArray(archivos)) {
      archivos.forEach((file: File) => {
        formData.append('files[]', file);  // 👈 nombre correcto
      });
    }

    const id = this.route.snapshot.paramMap.get('id');
    if (id) { 
      this.dataService.uploadFiles(id, formData).subscribe({
        next: (response) => {
          this.NotificationService.showSuccess('Archivos subidos con exito', `Los archivos fueron subidos`); // Muestra la notificación de éxito
          setTimeout(() => {
            window.location.reload();
          }, 500); 
        },
        error: (error) => { 
          this.NotificationService.showError('Error al subir archivos', error.error.message);
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