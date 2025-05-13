import { Component } from '@angular/core';
import { UdaService } from '../../service/uda.service';
import { FormGroup, FormControl, Validators, ReactiveFormsModule, FormArray } from '@angular/forms';
import { Router } from '@angular/router';
import { NotificationService } from '../../service/notification.service';

export interface User{
  name: string,
  username: string,
  password: string,
  role: string,
  permissions: Array<string>
}

@Component({
  selector: 'app-create-new-user',
  imports: [ReactiveFormsModule],
  templateUrl: './create-new-user.component.html',
  styleUrl: './create-new-user.component.css'
})
export class CreateNewUserComponent {
  constructor(      
    private router: Router,
    private notificationService: NotificationService,
    private udaService: UdaService,
  ){}
  
userForm= new FormGroup({
  name: new FormControl('', [Validators.required, Validators.maxLength(255)]), 
  username: new FormControl('', [Validators.required,  Validators.maxLength(255)]),
  password: new FormControl('',[Validators.required, Validators.maxLength(255)]), 
  role: new FormControl('', [Validators.required, Validators.maxLength(255)]),//
  permissions: new FormArray([], [Validators.required])
});

newU = this.userForm.value;
user = [];
selectedPhoto: string = '';
profilePictures = [
  { value: 'man', src: '/profile/mnpictureprofile.webp' },
  { value: 'woman', src: '/profile/wmnpictureprofile.webp' }
];

selectPhoto(value: string) {
  this.selectedPhoto = value;
}

onCheckboxChange(event: Event) {
  const checkbox = event.target as HTMLInputElement;
  const permissionsArray = this.userForm.get('permissions') as FormArray;

  if (checkbox.checked) {
    permissionsArray.push(new FormControl(checkbox.value));
  } else {
    const index = permissionsArray.controls.findIndex(x => x.value === checkbox.value);
    if (index >= 0) {
      permissionsArray.removeAt(index);
    }
  }
}

onSubmit(){
  this.newUser();
}

newUser(){
  if(this.userForm.valid){
    console.log(this.userForm.value);
    this.udaService.createUser(this.userForm.value).subscribe({
      next: () =>{
        //this.router.navigate(['/main/panel']);
        //this.notificationService.showSuccess('Acutalización exitosa', 'Nuevo usuario agregado');
      },
      error: (error) =>{
        //this.router.navigate(['/main/panel']);
        //console.log(error);
        this.notificationService.showError('¡Algo fallo!', error);
      }
    });
  }else {
    this.userForm.markAllAsTouched(); 
    this.notificationService.showError('Datos incompletos','Los Campos obligatorios no pueden estar vacíos');
  }
}

}
