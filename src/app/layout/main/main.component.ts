import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { HeaderComponent } from "../header/header.component";
import { RouterOutlet } from '@angular/router';
import { ErrorComponent } from "../message/error/error.component";
import { SuccessfulComponent } from "../message/successful/successful.component";
import { MatButtonModule } from '@angular/material/button';
import { MenuComponent } from "../menu/menu.component";

@Component({
  selector: 'app-main',
  imports: [HeaderComponent, RouterOutlet, ErrorComponent, SuccessfulComponent, MatButtonModule, MenuComponent],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css'
})

export class MainComponent {
  @ViewChild('menuNav') menuNav!: ElementRef;
  screenWidth = window.innerWidth;
  isMenuOpen = false;

  constructor(private eRef: ElementRef) {}
  @HostListener('window:resize', [])
  onWindowResize() {
    this.onResize();
  }
  onClickOutside(event: MouseEvent) {
    const clickedInsideMenu = this.menuNav?.nativeElement.contains(event.target);
    if (this.screenWidth < 1300 && this.isMenuOpen && !clickedInsideMenu) {
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
