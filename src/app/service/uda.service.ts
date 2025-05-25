import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { User } from '../models/document';
import { environment } from '../../environments/environment';

export interface filter {
  type: string,
  id: number
}

@Injectable({
  providedIn: 'root'
})
export class UdaService {
  private API_URL = environment.API_URL;

  constructor(private http: HttpClient) { }

  getUser(): Observable<any> {
    return this.http.get<any>(`${this.API_URL}user`);
  }

  infoUser(id: number): Observable<any>{
    return this.http.get<any>(`${this.API_URL}users/${id}`);
  }

  getUsers(): Observable<any> {
    return this.http.get<any>(`${this.API_URL}users`);
  }
 
  profile(): Observable<any>{
    return this.http.get<any>(`${this.API_URL}profile`);
  }
  updateProfile(user: any): Observable<any>{
    return this.http.put<any>(`${this.API_URL}profile`, user);
  }
  createUser(newUser: any): Observable<any>{
    return this.http.post<any>(`${this.API_URL}users/register`, newUser);
  }

   editUser(id: number, user: any): Observable<any>{
    return this.http.put<any>(`${this.API_URL}users/${id}` , user);
  }

  deleteUser(id: number): Observable<any>{
    return this.http.delete<any>(`${this.API_URL}users/${id}`);
  }

  dashboard(): Observable<any>{
    return this.http.get<any>(`${this.API_URL}dashboard`);
  }

  getActivities(): Observable<any>{
    return this.http.get<any>(`${this.API_URL}activities`);
  }

  filters(params: any): Observable<any> {
    return this.http.post<any>(`${this.API_URL}filters`, params);
  }
  notification(): Observable<any>{
    return this.http.get<any>(`${this.API_URL}notifications`)
  }

  searchDocuments(query: string): Observable<any> {
    const params = new HttpParams().set('query', query);
    return this.http.get(`${this.API_URL}search`, {params});
  }
}
