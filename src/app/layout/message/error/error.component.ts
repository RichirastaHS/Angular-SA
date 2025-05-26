import { Component, OnInit } from '@angular/core';
import { NotificationService, Notification } from '../../../service/notification.service';
import { animate, keyframes, state, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrl: './error.component.css',
  animations: [
      trigger('fade', [
        transition(':enter', [
          animate('200ms ease-in', keyframes([
            style({ opacity: 0, transform: 'translateX(100px) scale(0.9)', offset: 0 }),
            style({ opacity: 1, transform: 'translateX(0px) scale(1)', offset: 1 })
          ]))
        ]),
        transition(':leave', [
          animate('250ms ease-in', keyframes([
            style({ opacity: 1, transform: 'translateX(0) scale(1)', offset: 0 }),
            style({ opacity: 0, transform: 'translate(100px, -10px) scale(0.8)', offset: 1 })
          ]))
        ])
      ])
    ]
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
