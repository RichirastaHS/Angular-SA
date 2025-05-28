import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UdaService } from '../../service/uda.service';
import { NotificationService } from '../../service/notification.service';
import { Router } from '@angular/router';
import { AuthService } from '../../service/auth.service';
interface profileUser{
  name: string,
  username: string,
  email: string,
  profile_photo: File,
}
@Component({
  selector: 'app-edit-my-user',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './edit-my-user.component.html',
  styleUrl: './edit-my-user.component.css'
})
export class EditMyUserComponent {
user: profileUser={
  name: '',
  username: '',
  email: '',
  profile_photo: new File([], ''),
}
 selectedFile: File | null = null;
previewUrl: string | ArrayBuffer | null = null;

  profileForm = new FormGroup({
    name: new FormControl<string>('', [Validators.required]),
    username: new FormControl<string>('', [Validators.required]),
    new_password: new FormControl<string>('', ),
    new_password_confirmation: new FormControl<string>('', ),
    current_password: new FormControl<string>('', ),
    profile_photo: new FormControl<File | null>(null)
  });

  constructor(
    private udaService: UdaService,    
    private notificationService: NotificationService,   
    private router: Router,
    private authsService: AuthService
  ) { }
  ngOnInit(): void {
    this.udaService.profile().subscribe({
      next: (response) => {
        this.user= response;
        this.previewUrl = response.profile_photo; 
        this.profileForm.patchValue({
        name: this.user.name,
        username: this.user.username,
        // No asignamos las contraseñas porque son campos para cambios
        profile_photo: null // Mantenemos null para la foto, se manejará aparte
      });
      },
      error: (error) => {
      }
    });
  }
  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;

      const reader = new FileReader();
      reader.onload = () => {
        this.previewUrl = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit(): void {
  if (this.profileForm.valid) {
    const formData = new FormData();
    formData.append('_method', 'PATCH');

    // Solo enviamos los campos que fueron modificados (dirty)
    Object.keys(this.profileForm.controls).forEach((key) => {
      const control = this.profileForm.get(key);
      if (control?.dirty && control.value) {
        // Evitamos agregar profile_photo directamente aquí
        if (key !== 'profile_photo') {
          formData.append(key, control.value);
        }
      }
    });

    // Adjuntar imagen solo si fue seleccionada
    if (this.selectedFile) {
      formData.append('profile_photo', this.selectedFile);
    }

    this.udaService.updateProfile(formData).subscribe({
      next: (response) => {
        const userData = { name: this.profileForm.value.name };
        this.authsService.setUser(userData);
        this.router.navigate(['/main']);
        this.notificationService.showSuccess('Usuario actualizado correctamente', '¡Éxito!');
      },
      error: (error) => {
        this.notificationService.showError(error?.error?.message, '¡Oh no! Ocurrió un error inesperado');
      }
    });
  } else {
    this.notificationService.showError("Datos sin rellenar", 'Hay campos sin rellenar');
  }
}

}
