import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { User } from '../models/document';



@Injectable({
  providedIn: 'root'
})
export class UdaService {
  private API_URL = 'http://127.0.0.1:8000/api/';

  constructor(private http: HttpClient) { }

  getUsers(): Observable<any> {
    return this.http.get<any>(`${this.API_URL}Users`);
  }

  dashboard(): Observable<any>{
    return this.http.get<any>(`${this.API_URL}dashboard`);
  }

  getActivities(): Observable<any>{
    return this.http.get<any>(`${this.API_URL}activities`);
  }

  searchDocuments(query: string): Observable<any> {
    const params = new HttpParams().set('query', query);
    return this.http.get(`${this.API_URL}search`, {params});
  }
}
