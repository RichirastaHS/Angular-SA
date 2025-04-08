import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private successMessageSubject = new BehaviorSubject<string | null>(null);
  private errorMessageSubject = new BehaviorSubject<string | null>(null);

  successMessage$ = this.successMessageSubject.asObservable();
  errorMessage$ = this.errorMessageSubject.asObservable();

  showSuccess(message: string) {
    this.successMessageSubject.next(message);
  }

  showError(message: string) {
    this.errorMessageSubject.next(message);
  }

  clearMessages() {
    this.successMessageSubject.next(null);
    this.errorMessageSubject.next(null);
  }
}
