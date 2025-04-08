import { Component, Input } from '@angular/core';
import { NotificationService } from '../../../service/notification.service';


@Component({
  selector: 'app-error',
  imports: [],
  templateUrl: './error.component.html',
  styleUrl: './error.component.css'
})

export class ErrorComponent {
  message: string | null = null;
  isVisible = false;

  constructor(private notificationService: NotificationService) { }

  ngOnInit():void{
    this.notificationService.errorMessage$.subscribe((msg) => {
      if (msg) {
        this.message = msg;
        this.isVisible = true;
        setTimeout(() => this.isVisible = false, 3000);
      }
    });
  }

  closeMessage() {
    this.isVisible = false;
  }
}

