import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponse, Document } from '../models/document';

@Injectable({
  providedIn: 'root'
})

export class DataService{
  readonly API_URL = 'http://127.0.0.1:8000/api/documents';

  constructor (private http: HttpClient) { }

  getDocuments(): Observable<Document[]> {
    return this.http.get<Document[]>(this.API_URL, {}); 
  }

  createDocument(): Observable<any> {
    return this.http.get(this.API_URL);  
  }

  storeDocument(document: Document): Observable<any> {
    return this.http.post(this.API_URL, document);
  }

  getDocumentbyId(id: number): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${this.API_URL}/${id}`);
  }

  editDocument(id: number): Observable<any> {
    return this.http.get(`${this.API_URL}/${id}/edit`);
  }

  updateDocument(id: number, document:Document): Observable<any> {
    return this.http.patch(`${this.API_URL}/${id}`, document);
  }

  deleteDocument(id: number): Observable<any> {
    return this.http.delete(`${this.API_URL}/${id}`);
  }

}