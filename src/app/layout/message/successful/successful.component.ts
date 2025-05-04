import { Component } from '@angular/core';
import { NotificationService, Notification } from '../../../service/notification.service';

@Component({
  selector: 'app-successful',
  templateUrl: './successful.component.html',
  styleUrls: ['./successful.component.css']
})
export class SuccessfulComponent {
  messages: Notification[] = [];

  constructor(private notificationService: NotificationService) { }

  ngOnInit(): void {
    this.notificationService.successMessages$.subscribe((msgs) => {
      this.messages = msgs;
    });
  }

  closeMessage(id: number) {
    this.notificationService.removeSuccess(id);
  }
}
