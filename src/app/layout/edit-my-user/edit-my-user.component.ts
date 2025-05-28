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
    
    // Campos obligatorios
    formData.append('_method', 'PATCH');
    formData.append('name', this.profileForm.value.name!);
    formData.append('username', this.profileForm.value.username!);
    
    // Solo agregamos contraseñas si están definidas y no vacías
    const newPassword = this.profileForm.value.new_password;
    const newPasswordConfirmation = this.profileForm.value.new_password;
    const currentPassword = this.profileForm.value.current_password;

    if (newPassword) {
      formData.append('new_password', newPassword);
    }
    if (newPasswordConfirmation) {
      formData.append('new_password_confirmation', newPasswordConfirmation);
    }

    if (currentPassword) {
      formData.append('current_password', currentPassword);
    }


    // Adjuntar imagen solo si fue seleccionada
    if (this.selectedFile) {
      formData.append('profile_photo', this.selectedFile);
    }

    this.udaService.updateProfile(formData).subscribe({
      next: (response) => {
        const userData = { name: this.profileForm.value.name};
        this.authsService.setUser(userData);
        this.router.navigate(['/main']);
        this.notificationService.showSuccess('Usuario actualizado correctamente', '¡Éxito!');
      },
      error: (error) => {

        this.notificationService.showError(error, '¡Oh no! Ocurrió un error inesperado');
      }
    });
  } else {
    this.notificationService.showError("Datos sin rellenar", 'Hay campos sin rellenar');
  }
}
}
