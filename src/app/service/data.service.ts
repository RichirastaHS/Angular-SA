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

  getDocuments(options?: {
  page?: number;
  per_page?: number;
  status_id?: number;
  category_id?: number;
  start_date?: string; // Formato 'YYYY-MM-DD'
  end_date?: string;   // Formato 'YYYY-MM-DD'
}): Observable<any> {
  
  // Construye los parámetros de la URL
  const params = new URLSearchParams();

  if (options?.page) params.append('page', options.page.toString());
  if (options?.per_page) params.append('per_page', options.per_page.toString());
  if (options?.status_id) params.append('status_id', options.status_id.toString());
  if (options?.category_id) params.append('category_id', options.category_id.toString());
  if (options?.start_date) params.append('start_date', options.start_date);
  if (options?.end_date) params.append('end_date', options.end_date);

  const url = params.toString() 
    ? `${this.API_URL}?${params.toString()}`
    : this.API_URL;

  return this.http.get<any>(url);
}
  getpDocuments(page: string): Observable<any> {
    return this.http.get(page);
  }
  createDocument(): Observable<any> {
    return this.http.get(`${this.API_URL}/create`);  
  }

  storeDocument(formData: FormData): Observable<any> {
    return this.http.post<any>(`${this.API_URL}`, formData);
  }

  getDocumentbyId(id: string): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${this.API_URL}/${id}`);
  }

  editDocument(id: string): Observable<any> {
    return this.http.get(`${this.API_URL}/${id}/edit`);
  }

  updateDocument(id: string, document:any): Observable<any> {
    return this.http.patch(`${this.API_URL}/${id}`, document);
  }

  deleteDocument(id: string): Observable<any> {
    return this.http.delete(`${this.API_URL}/${id}`);
  }

  searchDocuments(query: string): Observable<Document[]> {
    return this.http.get<Document[]>(`${this.API_URL}/search`);
  }

}