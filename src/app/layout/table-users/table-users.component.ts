import { Component } from '@angular/core';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';

@Component({
  selector: 'app-table-users',
  imports: [MatTableModule, MatPaginatorModule,],
  templateUrl: './table-users.component.html',
  styleUrl: './table-users.component.css'
})
export class TableUsersComponent {
  columnsToDisplay  = ['Nombre', 'Alias', 'Correo', 'Role', 'Permisos', 'Acciones'];
  dataSource = new MatTableDataSource<any>();


}
