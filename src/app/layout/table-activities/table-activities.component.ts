import { Component } from '@angular/core';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-table-activities',
  imports: [MatTableModule, MatPaginatorModule],
  templateUrl: './table-activities.component.html',
  styleUrl: './table-activities.component.css'
})
export class TableActivitiesComponent {
  columnsToDisplay  = ['Nombre', 'Alias', 'Correo', 'Role', 'Permisos', 'Acciones'];
  dataSource = new MatTableDataSource<any>();
}
