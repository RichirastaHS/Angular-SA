import { Component, HostListener, ElementRef } from '@angular/core';
import {MatMenuModule} from '@angular/material/menu';
import {MatButtonModule} from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-menu',
  imports: [MatButtonModule, MatMenuModule, RouterLink, CommonModule],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css'
})
export class MenuComponent {
screenWidth = window.innerWidth;
  isMenuOpen = false;

  constructor(private eRef: ElementRef) {}
  @HostListener('window:resize', [])
  onWindowResize() {
    this.onResize();
  }
  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent) {
    if (this.screenWidth < 1300 && this.isMenuOpen && !this.eRef.nativeElement.contains(event.target)) {
      this.isMenuOpen = false;
    }
  }

  ngOnInit() {
    this.onResize();
  }

  onResize() {
    this.screenWidth = window.innerWidth;
    if(this.screenWidth < 1300){
      this.isMenuOpen = false;
    }
    if(this.screenWidth > 1300){
      this.isMenuOpen = true;
    }
  }

  changeMenuOpen(){
    this.isMenuOpen = !this.isMenuOpen;
  }
}
