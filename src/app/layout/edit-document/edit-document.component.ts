import { Component } from '@angular/core';
import { DataService } from '../../service/data.service';
import { ActivatedRoute, Router} from '@angular/router';
import { CommonModule } from '@angular/common';
import { documentFormData, DocumentFormModel } from '../../models/trackingDocs';
import {AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, Validators} from '@angular/forms';
import { ApiResponse, Document } from '../../models/document';
import { NotificationService } from '../../service/notification.service';

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
  selector: 'app-edit-document',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './edit-document.component.html',
  styleUrl: './edit-document.component.css'
})
export class EditDocumentComponent {
  document!: Document;

  datosDocumento = new FormGroup({
  title: new FormControl<string>('', [Validators.required, Validators.maxLength(255)]),
  reference_number: new FormControl<string>('', [Validators.required, Validators.maxLength(255)]),
  category_id: new FormControl<any>('', [Validators.required]),
  status_id: new FormControl<any>('', [Validators.required]),
  sender_department_id: new FormControl<any | string>(0),
  new_sender_department: new FormControl<string | "">(''), // Nuevo campo opcional
  receiver_department_id: new FormControl<any>(null, [Validators.required]),
  issue_date: new FormControl<string>('', [Validators.required]),
  received_date: new FormControl<string>('', [Validators.required]),
  description: new FormControl<string>(''),
  priority: new FormControl<string>('', [Validators.required]),
  }, );
  filesdata: FileData[] = [];
  newDocData = this.datosDocumento.value;
  formData: DocumentFormModel = documentFormData;
  selectedFiledata: FileData | null = null;
  typeText: boolean = false;
  docid: string = "";
  deleteFileId: number = 0;
  mostrarModal = false;
  
  constructor(
    private dataService: DataService, 
    private route: ActivatedRoute,
    private router: Router,
    private notificationService: NotificationService
  ) { }

  ngOnInit(): void {
    this.docid = this.route.snapshot.paramMap.get('id')!;
    if(this.docid){
      this.dataService.editDocument(this.docid).subscribe({
        next: (response) => {
          this.formData.categories = response.categories || [];
          this.formData.statuses = response.statuses || [];
          this.formData.senders_department = response.senders_department || [];
          this.formData.receivers_department = response.receivers_department || [];
          this.formData.priority = response.priority || [];
        },
        error: (error) => {
          this.router.navigate(['/main']);
          this.notificationService.showError(error.statusText, '¡Oh no! Ocurrio un error inesperado');

        }
      });
      this.dataService.getDocumentbyId(this.docid).subscribe({  
        next: (response) => {
          this.document = response.document; 
          this.datosDocumento.patchValue({
            title: this.document.title,
            reference_number: this.document.reference_number,
            category_id: this.document.category?.id,
            status_id: this.document.status?.id ? Number(this.document.status.id) : null,
            sender_department_id: this.document.sender_department?.id,
            receiver_department_id: this.document.receiver_department?.id,
            issue_date: this.document.issue_date,
            received_date: this.document.received_date,
            description: this.document.description,
            priority: this.document.priority,
          });
          this.filesdata= response.document.files;
        },
        error: (error) => {
          this.router.navigate(['/main']);
          this.notificationService.showError(error.statusText, '¡Oh no! Ocurrio un error inesperado');
        }
      });
    } 
  }
  
  onSubmit() {
  console.log("asdas");
  console.log(this.datosDocumento.value);
  
  if (this.datosDocumento.valid) {
    const senderDept = this.datosDocumento.get('sender_department_id')?.value;
    const newSenderDept = this.datosDocumento.get('new_sender_department')?.value;

    const jsonData: any = {};

    Object.keys(this.datosDocumento.controls).forEach(key => {
      const control = this.datosDocumento.get(key);
      if (!control || control.value === null || control.value === undefined) return;

      // Excluir sender_department_id si se está usando un nuevo departamento
      if (key === 'sender_department_id' && newSenderDept) return;

      // Excluir new_sender_department si NO se está usando un nuevo departamento
      if (key === 'new_sender_department' && !newSenderDept) return;

      jsonData[key] = control.value;
    });

    console.log("jsonData", jsonData);

    this.dataService.updateDocument(this.document.id, jsonData).subscribe({
      next: (response) => {
        this.router.navigate(['/main']);
        this.notificationService.showSuccess('Actualizado', 'Documento actualizado con éxito');
      },
      error: (error) => {
        console.log(error)
        this.notificationService.showError('Error en la actualizacion', error.statusText);
      }
    });

  } else {
    this.datosDocumento.markAllAsTouched(); 
    this.notificationService.showError('Error al rellenar los datos', 'Los Campos obligatorios no pueden estar vacíos');
  }
}

deleteFile() {
  this.mostrarModal = false;
  this.dataService.deleteFile(this.docid, this.deleteFileId).subscribe({
    next: (response) => {
      this.filesdata = this.filesdata.filter(file => file.id !== this.deleteFileId);
      this.notificationService.showSuccess('Archivo eliminado', 'El archivo ha sido eliminado con éxito');
    },
    error: (error) => {
      this.notificationService.showError('Error al eliminar el archivo', error.statusText);
    }
  });
}

SelecttoText(event: Event) {
  const select = this.datosDocumento.get('sender_department_id');
  if (select?.value === 'NewDep') {
    this.typeText = true;
    this.datosDocumento.patchValue({ sender_department_id: 0 });
  } else {
    this.negTypeText();  // resetea el campo adicional si elige un departamento válido
  }
}

negTypeText() {
  this.typeText = false;
  this.datosDocumento.patchValue({ new_sender_department: '' });
}

  senderDepartmentValidator(group: AbstractControl): ValidationErrors | null {
  const sender = group.get('sender_department_id')?.value;
  const newSender = group.get('new_sender_department')?.value;
  return sender || newSender ? null : { senderMissing: true };
}


abrirModal(id: number) {
    const archivo = this.filesdata .find(file => file.id === id);
    this.selectedFiledata = archivo || null;
    console.log(archivo?.original_name);
    this.mostrarModal = true;
    this.deleteFileId = id;
}

  cerrarModal() {
    this.mostrarModal = false;
  }

}

