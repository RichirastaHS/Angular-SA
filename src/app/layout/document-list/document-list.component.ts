import {Component} from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import {MatSelectModule} from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { TableRComponent } from "../table-r/table-r.component";


@Component({
  selector: 'app-document-list',
  imports: [MatSelectModule, CommonModule, MatIconModule, MatButtonModule, TableRComponent],
  templateUrl: './document-list.component.html',
  styleUrl: './document-list.component.css'
})


export class DocumentListComponent{
  statusId: number = 0;

  setid(number: number){
    this.statusId = number;
  }
}
