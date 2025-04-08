import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponse, Document } from '../models/document';
import { DocumentCreate } from '../models/newDocData';

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
    return this.http.get(`${this.API_URL}/create`);  
  }

  storeDocument(document: any): Observable<any> {
    return this.http.post(this.API_URL, document);
  }

  getDocumentbyId(id: string): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${this.API_URL}/${id}`);
  }

  editDocument(id: string): Observable<any> {
    return this.http.get(`${this.API_URL}/${id}/edit`);
  }

  updateDocument(id: string, document:Document): Observable<any> {
    return this.http.patch(`${this.API_URL}/${id}`, document);
  }

  deleteDocument(id: string): Observable<any> {
    return this.http.delete(`${this.API_URL}/${id}`);
  }

  searchDocuments(query: string): Observable<Document[]> {
    return this.http.get<Document[]>(`${this.API_URL}/search`);
  }

}