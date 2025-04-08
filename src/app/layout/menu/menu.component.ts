import { Component, HostListener } from '@angular/core';
import {MatMenuModule} from '@angular/material/menu';
import {MatButtonModule} from '@angular/material/button';
import { RouterOutlet, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-menu',
  imports: [MatButtonModule, MatMenuModule, RouterOutlet, RouterLink, CommonModule],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css'
})
export class MenuComponent {
screenWidth = window.innerWidth;
  isMenuOpen = false;
  @HostListener('window:resize')
  onResize() {
    this.screenWidth = window.innerWidth;
    if(this.screenWidth < 1300){
      this.isMenuOpen = false;
    }
    if(this.screenWidth > 1300){
      this.isMenuOpen = true;
    }
  }
  ngOnInit() {
    this.onResize();
  }

  changeMenuOpen(){
    this.isMenuOpen = !this.isMenuOpen;
  }
}
