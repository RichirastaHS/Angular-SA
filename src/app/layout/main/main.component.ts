import { Component } from '@angular/core';
import { HeaderComponent } from "../header/header.component";
import { RouterLink, RouterOutlet } from '@angular/router';
import { ErrorComponent } from "../message/error/error.component";
import { SuccessfulComponent } from "../message/successful/successful.component";

@Component({
  selector: 'app-main',
  imports: [HeaderComponent, RouterOutlet, RouterLink, ErrorComponent, SuccessfulComponent],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css'
})
export class MainComponent {

}
