import { Component } from '@angular/core';
import { DropdownMenuComponent } from "../dropdown-menu/dropdown-menu.component";
import { MatIconModule } from '@angular/material/icon';
import { FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import { SearchService } from '../../service/search.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-header',
  imports: [DropdownMenuComponent, MatIconModule, ReactiveFormsModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {

  searchForm= new FormGroup({
    busqueda: new FormControl<string | null>("")
  });
  constructor(
    private searchService: SearchService,
    private router: Router,
  ) { }

  onSearch(): void {
    const query = this.searchForm.value.busqueda || '';
    this.searchService.setSearchQuery(query);
    this.router.navigate(['/main/busqueda'], { queryParams: { query } });
  }

}
