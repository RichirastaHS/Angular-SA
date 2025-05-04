import { Component, OnInit } from '@angular/core';
import { NotificationService, Notification } from '../../../service/notification.service';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrl: './error.component.css',
})
export class ErrorComponent implements OnInit {
  errorMessages: Notification[] = [];

  constructor(private notificationService: NotificationService) {}

  ngOnInit(): void {
    this.notificationService.errorMessages$.subscribe((msgs) => {
      this.errorMessages = msgs;
    });
  }

  closeMessage(id: number) {
    this.notificationService.removeError(id);
  }
}
