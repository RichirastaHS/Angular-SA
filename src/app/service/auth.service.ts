import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, of, tap, throwError } from 'rxjs';
import { User } from '../models/user';
import { BehaviorSubject } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private API_URL = environment.API_URL;

  private userSubject = new BehaviorSubject<any>(null);
  user$ = this.userSubject.asObservable(); 

  constructor(private http: HttpClient) {
    const userData = JSON.parse(localStorage.getItem('user') || 'null');
    if (userData) {
      this.userSubject.next(userData);
    }
   }

  registerUser(user: any): Observable<any> {
    return this.http.post(`${this.API_URL}register`, user);
  }

  loginUser(user: any): Observable<any> {
    return this.http.post<any>(`${this.API_URL}login`, user).pipe(
      map((response) => {
        if (response.access_token) {
          localStorage.setItem('access_token', response.access_token); 
        }
        return response; 
      }),
      catchError(this.handleError) // Maneja errores correctamente
    );
  }
  getAccessToken() {
    return localStorage.getItem('access_token') || '';
  }

  getUserData(): Observable<any> {
    return this.http.get<any>(`${this.API_URL}user`);
  }

  setUser(user: any) {
    this.userSubject.next(user);
    localStorage.setItem('user', JSON.stringify(user));
  }

  isLoggedIn(): Observable<boolean> {
    return this.http.get<any>(`${this.API_URL}check_token`).pipe(
      map(response => response.valid), // extraemos solo el booleano
      catchError(() => of(false))      // en caso de error, lo tratamos como "no logueado"
    );
  }

getPermissions(): any {
  const permissions = localStorage.getItem('permissions');
  return permissions ? JSON.parse(permissions) : null;
}
isAdminUser(): boolean {
  return localStorage.getItem('isUserAdmin') === 'true';
}

  logoutUser(): Observable<any> {
  return this.http.post(`${this.API_URL}logout`, {}).pipe(
    tap((response) => {
      // Eliminación explícita de cada item
      const itemsToRemove = ['access_token', 'isUserAdmin', 'user', 'permissions'];
      itemsToRemove.forEach(item => localStorage.removeItem(item));
      
      // Limpieza adicional para asegurar
      if (localStorage.length > 0) {
        localStorage.clear();
      }
      
      // Verificación final
      console.log('Storage after logout:', localStorage);
    }),
    catchError(error => {
      localStorage.clear();
      return throwError(error);
    })
  );
}

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Contraseña o correo incorrecto';
    return throwError(() => new Error(errorMessage));
  }
}