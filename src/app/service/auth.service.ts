import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, of, tap, throwError } from 'rxjs';
import { User } from '../models/user';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private API_URL = 'http://127.0.0.1:8000/api/';

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
  const token = localStorage.getItem('access_token');
  if (token) {
    return of(true);
  } else {
    return this.getUserData().pipe(
      map(() => true),
      catchError(() => of(false))
    );
  }
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