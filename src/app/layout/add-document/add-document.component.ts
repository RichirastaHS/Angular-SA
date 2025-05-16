import { Component } from '@angular/core';
import { documentFormData, DocumentFormModel } from '../../models/trackingDocs';
import { Router } from '@angular/router';
import { DataService } from '../../service/data.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NotificationService } from '../../service/notification.service';

@Component({
  selector: 'app-add-document',
  imports: [ReactiveFormsModule],
  templateUrl: './add-document.component.html',
  styleUrl: './add-document.component.css'
})
export class AddDocumentComponent {
  
  datosDocumento = new FormGroup({
    title: new FormControl<string>('', [Validators.required, Validators.maxLength(255)]), 
    reference_number: new FormControl<string>('', [Validators.required, Validators.maxLength(255)]),
    category: new FormControl<string>('',[Validators.required]), 
    status: new FormControl<string>('', [Validators.required]),
    sender_department: new FormControl<string>('',[Validators.required]),
    receiver_department: new FormControl<string>('',[Validators.required]),
    issue_date: new FormControl<string>('',[Validators.required]),
    received_date: new FormControl<string>('',[Validators.required]),
    description: new FormControl<string>(''),
    priority: new FormControl<string>('',[Validators.required]),
    document_file: new FormControl<File | null>(null) // Properly typed file control
  });

  formData: DocumentFormModel = documentFormData;
  selectedFile: File | null = null;
  fileName: string = '';

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

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      
      if (file) {
        // Check if file is PDF
        if (file.type !== 'application/pdf') {
          this.notificationService.showError('Formato incorrecto', 'Solo se permiten archivos PDF');
          return;
        }
        
        // Check file size (e.g., 5MB limit)
        if (file.size > 5 * 1024 * 1024) {
          this.notificationService.showError('Archivo demasiado grande', 'El tamaño máximo permitido es 5MB');
          return;
        }
        
        this.selectedFile = file;
        this.fileName = file.name;
        this.datosDocumento.patchValue({
          document_file: file
        });
        // Mark the control as touched
        this.datosDocumento.controls.document_file.markAsTouched();
      }
    }
  }

  onSubmit() {
    if (this.datosDocumento.valid) {
      const formData = new FormData();
      
      // Append all form values to FormData
      Object.keys(this.datosDocumento.controls).forEach(key => {
        const control = this.datosDocumento.get(key);
        if (control && control.value !== null && control.value !== undefined) {
          if (key === 'document_file' && this.selectedFile) {
            formData.append(key, this.selectedFile, this.selectedFile.name);
          } else {
            formData.append(key, control.value);
          }
        }
      });

      this.dataService.storeDocument(formData).subscribe({
        next: (response) => {
          this.router.navigate(['/main']);
          this.notificationService.showSuccess('Creación exitosa', 'Documento creado con éxito');
        },
        error: (error) => {
          console.log(error);
          this.router.navigate(['/main']);
          this.notificationService.showError('¡Algo falló!', error);
        }
      });
    } else {
      this.datosDocumento.markAllAsTouched(); 
      this.notificationService.showError('Datos incompletos', 'Los Campos obligatorios no pueden estar vacíos');
    }
  }
}