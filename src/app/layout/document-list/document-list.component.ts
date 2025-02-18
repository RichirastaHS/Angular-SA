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


@Component({
  selector: 'app-document-list',
  imports: [RouterLink, MatSelectModule, CommonModule, MatTableModule, MatPaginatorModule, MatIconModule, MatButtonModule],
  templateUrl: './document-list.component.html',
  styleUrl: './document-list.component.css'
})


export class DocumentListComponent implements AfterViewInit{
  columnsToDisplay  = ['Nombre', 'Tipo', 'Fecha de recepción', 'Fecha de registro', 'Estatus', 'Acciones'];
  document: Document[] = [];
  dataSource = new MatTableDataSource<Document>();
  

  constructor(private dataService: DataService, private authService: AuthService) { }
  
  ngOnInit(): void {
      
    this.dataService.getDocuments().subscribe({  
      next: (document: Document[]) => {
        this.document = document;
        this.dataSource.data = document;
      },
      error: (error) => {
      }
    });
  }
  

  @ViewChild(MatPaginator)
  paginator: MatPaginator = new MatPaginator;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }
}
