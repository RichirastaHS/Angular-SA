import {Component, Input, SimpleChanges, ViewChild} from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import {MatSelectModule} from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { DataService } from '../../service/data.service';
import { AuthService } from '../../service/auth.service';
import { ApiResponse, Document } from '../../models/document';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { NotificationService } from '../../service/notification.service';

@Component({
  selector: 'app-table-r',
  imports: [RouterLink, MatSelectModule, CommonModule, MatTableModule, MatPaginatorModule, MatIconModule, MatButtonModule, MatProgressSpinnerModule],
  templateUrl: './table-r.component.html',
  styleUrl: './table-r.component.css'
})
export class TableRComponent {
  @Input() id_status?: number;

  isLoading = false;
  columnsToDisplay  = ['Nombre', 'Tipo', 'Fecha de recepción', 'Fecha de registro', 'Estatus', 'Acciones'];
  document: Document[] = [];
  dataSource = new MatTableDataSource<Document>();

  constructor(
    private route: ActivatedRoute,
    private dataService: DataService, 
    private NotificationService: NotificationService,
    private router: Router,) { }
  
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['id_status'] && this.document.length > 0) {
      this.applyFilter();
    }
  }

  ngOnInit(): void {
    this.isLoading = true;
    this.dataService.getDocuments().subscribe({ 
      next: (document: Document[]) => {
        if(this.id_status != 0){
          console.log(this.id_status);
          this.dataSource.data = document.filter(doc => doc.status_id === this.id_status);
          this.isLoading = true; 
        }
        else{
          console.log(this.id_status);
          this.document = document;
          this.dataSource.data = document;
          this.isLoading = true;
        }
      },
      error: (error) => {
      }
    });
  }

  applyFilter(): void {
    if (this.id_status) {
      this.dataSource.data = this.document.filter(doc => doc.status_id === this.id_status);
    } else {
      this.dataSource.data = this.document;
    }
  }

  deletedoc(id: string): void {
        this.dataService.deleteDocument(id).subscribe({  
          next: (response: ApiResponse) => {
            this.dataSource.data = this.dataSource.data.filter(doc => doc.id !== id);
            this.NotificationService.showSuccess('Documento borrado con exito'); // Muestra la notificación de éxito
          },
          error: (error) => {
            console.log(error); 
          }
        });
    }

  @ViewChild(MatPaginator)
  paginator: MatPaginator = new MatPaginator;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }
}
