import { Component } from '@angular/core';

@Component({
  selector: 'app-create-new-user',
  imports: [],
  templateUrl: './create-new-user.component.html',
  styleUrl: './create-new-user.component.css'
})
export class CreateNewUserComponent {
  selectedPhoto: string = '';
profilePictures = [
  { value: 'woman', src: '/business-woman.png' },
  { value: 'man', src: '/businessman.png' }
];

selectPhoto(value: string) {
  this.selectedPhoto = value;
}
}
