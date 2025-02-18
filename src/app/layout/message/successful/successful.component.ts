import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-successful',
  imports: [],
  templateUrl: './successful.component.html',
  styleUrl: './successful.component.css'
})
export class SuccessfulComponent {
    @Input() message?: string;
  
}
