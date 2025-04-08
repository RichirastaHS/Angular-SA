import { Component, Input } from '@angular/core';
import { NotificationService } from '../../../service/notification.service';

@Component({
  selector: 'app-successful',
  imports: [],
  templateUrl: './successful.component.html',
  styleUrl: './successful.component.css'
})
export class SuccessfulComponent {
  message: string | null = null;
  isVisible = false;

  constructor(private notificationService: NotificationService) { }
  ngOnInit():void{
    this.notificationService.successMessage$.subscribe((msg) => {
      if( msg) {
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

