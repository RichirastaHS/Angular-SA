import {AfterViewInit, Component, ViewChild} from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import {MatSelectModule} from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { DataService } from '../../service/data.service';
import { AuthService } from '../../service/auth.service';
import { Document } from '../../models/document';
import { TableRComponent } from "../table-r/table-r.component";


@Component({
  selector: 'app-document-list',
  imports: [RouterLink, MatSelectModule, CommonModule, MatTableModule, MatPaginatorModule, MatIconModule, MatButtonModule, TableRComponent],
  templateUrl: './document-list.component.html',
  styleUrl: './document-list.component.css'
})


export class DocumentListComponent{
  statusId: number = 0;

  setid(number: number){
    this.statusId = number;
  }
}
