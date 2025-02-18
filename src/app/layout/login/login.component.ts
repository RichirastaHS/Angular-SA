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
  email: FormControl;
  password: FormControl;
  errorMessage = '';
  loading = false;

  constructor( private authsService: AuthService, private router: Router, private authGuard: AuthGuard) {
    this.email = new FormControl('');
    this.password = new FormControl('');
    this.userForm = new FormGroup({
      email: this.email,
      password: this.password
    });
  }

  loginUser() {
    this.loading = true;
    this.authsService.loginUser(this.userForm.value).subscribe({
      next: (response)=> {
        this.authsService.getUserData().subscribe({
          next: (user: any) => {
            const userData = { name: user.name, email: user.email };
            this.authsService.setUser(userData);
          },
        });
        this.router.navigate(['/main']);
      },
      error: (error)=> {
        this.errorMessage = error.message
        this.loading = false; // Reactiva el botón y oculta el spinner
      },
      
    });
    
  }
}
