import { Component } from '@angular/core';
import { DropdownMenuComponent } from "../dropdown-menu/dropdown-menu.component";
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-header',
  imports: [DropdownMenuComponent, MatIconModule],
  template: `
    <header>
      <form action="" >
        <input type="search" name="search" id="search" placeholder="Buscar"> 
        <button type="submit">
          <mat-icon>search</mat-icon>

        </button>
      </form>
        <app-dropdown-menu></app-dropdown-menu>
    </header>
  `,
  styleUrl: './header.component.css'
})
export class HeaderComponent {

}
