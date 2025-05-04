import { Component } from '@angular/core';
import { DataService } from '../../service/data.service';
import { ActivatedRoute, Router} from '@angular/router';
import { CommonModule } from '@angular/common';
import { documentFormData, DocumentFormModel } from '../../models/trackingDocs';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { ApiResponse, Document } from '../../models/document';
import { NotificationService } from '../../service/notification.service';


@Component({
  selector: 'app-edit-document',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './edit-document.component.html',
  styleUrl: './edit-document.component.css'
})
export class EditDocumentComponent {
  document!: Document;

  datosDocumento = new FormGroup({
    title: new FormControl<string | null>(null, [Validators.required, Validators.maxLength(255)]),
    reference_number: new FormControl<string | null>(null, [Validators.required, Validators.maxLength(255)]),
    category: new FormControl<number | null>(null, [Validators.required]),
    status: new FormControl<number | null>(null, [Validators.required]),
    sender_department: new FormControl<number | null>(null, [Validators.required]),
    receiver_department: new FormControl<number | null>(null, [Validators.required]),
    issue_date: new FormControl<string | null>(null, [Validators.required]),
    received_date: new FormControl<string | null>(null, [Validators.required]),
    description: new FormControl<string | null>(null),
    priority: new FormControl<string | null>(null, [Validators.required])
  });

  newDocData = this.datosDocumento.value;

  formData: DocumentFormModel = documentFormData;

  constructor(
    private dataService: DataService, 
    private route: ActivatedRoute,
    private router: Router,
    private notificationService: NotificationService
  ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if(id){
      this.dataService.editDocument(id).subscribe({
        next: (response) => {
          console.log(response);
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
      this.dataService.getDocumentbyId(id).subscribe({  
        next: (response: ApiResponse) => {
          this.document = response.document; 
          this.datosDocumento.patchValue({
            title: this.document.title,
            reference_number: this.document.reference_number,
            category: this.document.category?.id,
            status: this.document.status?.id ? Number(this.document.status.id) : null,
            sender_department: this.document.sender_department?.id,
            receiver_department: this.document.receiver_department?.id,
            issue_date: this.document.issue_date,
            received_date: this.document.received_date,
            description: this.document.description,
            priority: this.document.priority
          });
        },
        error: (error) => {
          this.router.navigate(['/main']);
          this.notificationService.showError(error.statusText, '¡Oh no! Ocurrio un error inesperado');
        }
      });
    } 
  }
  
  onSubmit() {
    console.log(this.datosDocumento.value);
    if (this.datosDocumento.valid) {
      this.dataService.updateDocument(this.document.id, this.datosDocumento.value).subscribe({
        next: (response) => {
          this.router.navigate(['/main']);
          this.notificationService.showSuccess('Eso tilin', 'Documento actualizado con éxito');
        },
        error: (error) => {
          console.log(error)
          this.router.navigate(['/main']);
          this.notificationService.showError('Error en la actualizacion', error.statusText);
        }
      });
    } else {
      this.datosDocumento.markAllAsTouched(); 
      this.notificationService.showError('Eso tilin', 'Los Campos obligatorios no pueden estar vacíos');
    }
  }
}

