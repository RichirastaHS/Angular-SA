import { Component } from '@angular/core';
import { AuthService } from '../../service/auth.service';
import { Router } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AuthGuard } from '../../core/guards/auth.guard';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';

@Component({
  standalone: true,
  selector: 'app-login',
  imports: [ReactiveFormsModule, MatProgressSpinnerModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  userForm: FormGroup;
  username: FormControl;
  password: FormControl;
  errorMessage = '';
  loading = false;
  role: string = '';
  constructor( 
    private authsService: AuthService, 
    private router: Router, 
    private authGuard: AuthGuard,
  ) {
    this.username = new FormControl('');
    this.password = new FormControl('');
    this.userForm = new FormGroup({
      username: this.username,
      password: this.password
    });
  }

  loginUser() {
    this.loading = true;
    this.authsService.loginUser(this.userForm.value).subscribe({
      next: (response) => {
  this.authsService.getUserData().subscribe({
    next: (user: any) => {
      const userData = { name: user.name, email: user.email };
  this.authsService.setUser(userData);
  const role = user.role;
  
  if (role !== 'admin') {
    localStorage.setItem('isUserAdmin', 'false');

    // Corregir aquí: usar user.permission en lugar de user.permissions
    const permissions = {
      create: user.permission.includes('create'),  // singular
      read: user.permission.includes('read'),     // singular
      update: user.permission.includes('update'), // singular
      delete: user.permission.includes('delete'), // singular
    };
    
    localStorage.setItem('permissions', JSON.stringify(permissions));
  } else {
    localStorage.setItem('isUserAdmin', 'true');
    
    const adminPermissions = {
      create: true,
      read: true,
      update: true,
      delete: true
    };
    localStorage.setItem('permissions', JSON.stringify(adminPermissions));
    }
      this.router.navigate(['/main']);
    },
    error: (error) => {
      this.router.navigate(['/main']); // O manejar el error de otra forma
    }
  });
},
error: (error) => {
  this.errorMessage = error.message;
  this.loading = false;
}
    });
    
  }
}
