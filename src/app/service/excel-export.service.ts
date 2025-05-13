import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ExcelExportService {
  private exportRequested = new Subject<void>();

  exportRequested$ = this.exportRequested.asObservable();

  requestExport() {
    this.exportRequested.next();
  }
}