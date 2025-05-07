import { Component } from '@angular/core';
import { documentFormData, DocumentFormModel } from '../../models/trackingDocs';
import { Router } from '@angular/router';
import { DataService } from '../../service/data.service';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { NotificationService } from '../../service/notification.service';

@Component({
  selector: 'app-add-document',
  imports: [ReactiveFormsModule],
  templateUrl: './add-document.component.html',
  styleUrl: './add-document.component.css'
})
export class AddDocumentComponent {
  
  datosDocumento= new FormGroup({
    title: new FormControl('', [Validators.required, Validators.maxLength(255)]), 
    reference_number: new FormControl('', [Validators.required,  Validators.maxLength(255)]),
    category: new FormControl('',[Validators.required]), 
    status: new FormControl('', [Validators.required]),//
    sender_department: new FormControl('',[Validators.required]),//
    receiver_department: new FormControl('',[Validators.required]),//
    issue_date: new FormControl('',[Validators.required]),//
    received_date: new FormControl('',[Validators.required]),
    description: new FormControl(''), //
    priority: new FormControl('',[Validators.required])
  });
 
  formData: DocumentFormModel = documentFormData;


    constructor(
      private dataService: DataService, 
      private router: Router,
      private notificationService: NotificationService
    ) { }
  
    ngOnInit(): void {
      this.dataService.createDocument().subscribe({
        next: (response) => {
          console.log(response);
          this.formData.categories = response.categories || [];
          this.formData.statuses = response.statuses || [];
          this.formData.senders_department = response.senders_department || [];
          this.formData.receivers_department = response.receivers_department || [];
        },
        error: (error) => {
          console.log(error);
        }
      }); 
    }

    onSubmit() {

      if (this.datosDocumento.valid) {
        this.dataService.storeDocument(this.datosDocumento.value).subscribe({
          next: (response) => {
            this.router.navigate(['/main']);
            this.notificationService.showSuccess('Acutalización exitosa', 'Documento creado con éxito');
          },
          error: (error) => {
            this.router.navigate(['/main']);
            this.notificationService.showError('¡Algo fallo!', error);
          }
        });
      } else {
        this.datosDocumento.markAllAsTouched(); 
        this.notificationService.showError('Datos incompletos','Los Campos obligatorios no pueden estar vacíos');
      }
    }
}
