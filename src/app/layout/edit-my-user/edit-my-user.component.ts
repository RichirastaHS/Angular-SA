import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UdaService } from '../../service/uda.service';
import { NotificationService } from '../../service/notification.service';
import { Router } from '@angular/router';
interface profileUser{
  name: string,
  username: string,
  email: string,
  profile_photo: string,
}
@Component({
  selector: 'app-edit-my-user',
  imports: [ReactiveFormsModule],
  templateUrl: './edit-my-user.component.html',
  styleUrl: './edit-my-user.component.css'
})
export class EditMyUserComponent {
user: profileUser={
  name: '',
  username: '',
  email: '',
  profile_photo: '',
}
 selectedFile: File | null = null;
previewUrl: string | ArrayBuffer | null = null;

  profileForm = new FormGroup({
    name: new FormControl<string>('', [Validators.required]),
    username: new FormControl<string>('', [Validators.required]),
    new_password: new FormControl<string>('', [Validators.required]),
    current_password: new FormControl<string>('', [Validators.required]),
    profile_photo: new FormControl<File | null>(null)
  });

  constructor(
    private udaService: UdaService,    
    private notificationService: NotificationService,   
    private router: Router,
  ) { }
  ngOnInit(): void {
    this.udaService.profile().subscribe({
      next: (response) => {
        this.user= response;
        this.profileForm.patchValue({
        name: this.user.name,
        username: this.user.username,
        // No asignamos las contraseñas porque son campos para cambios
        profile_photo: null // Mantenemos null para la foto, se manejará aparte
      });
      },
      error: (error) => {
        console.error(error);
      }
    });
  }
  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      
      // Mostrar vista previa de la imagen
      const reader = new FileReader();
      reader.onload = () => {
        this.previewUrl = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit(): void {
    if (this.profileForm.valid) {
      const formData = new FormData();
      formData.append('name', this.profileForm.value.name!);
      formData.append('username', this.profileForm.value.username!);
      formData.append('new_password', this.profileForm.value.new_password!);
      formData.append('current_password', this.profileForm.value.current_password!);
      
      if (this.selectedFile) {
        formData.append('profile_photo', this.selectedFile);
      }

      this.udaService.updateProfile(formData).subscribe({
        next: (response) => {
          this.router.navigate(['/main']);
          this.notificationService.showSuccess('Usuario actualizad correctamente', '¡Exito!');
          // Manejar éxito (redirección, mensaje, etc.)
        },
        error: (error) => {
          this.notificationService.showError(error, '¡Oh no! Ocurrió un error inesperado');
        }
      });
    }
  }
}
