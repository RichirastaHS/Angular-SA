import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import { UdaService } from '../../service/uda.service';
import { User } from '../../models/user';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogClose, MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TableRComponent, DialogData } from '../table-r/table-r.component';
import { NotificationService } from '../../service/notification.service';

export interface usuario {
  id: number
  name: string;
  username: string;
  email: string;
}

@Component({
  selector: 'app-table-users',
  imports: [MatTableModule, MatPaginatorModule, RouterLink, ],
  templateUrl: './table-users.component.html',
  styleUrl: './table-users.component.css'
})
export class TableUsersComponent {
  constructor(
    private udaService: UdaService,
    private NotificationService: NotificationService
  ){}
  isLoading = false;
  columnsToDisplay  = ['Nombre', 'Alias', 'Correo', 'Acciones'];
  users: usuario[] = [];
  dataSource = new MatTableDataSource<usuario>();
  readonly dialog = inject(MatDialog);

  ngOnInit(){
    this.udaService.getUsers().subscribe({
      next: (response) => {
        this.users = response.map((user: any) => ({
          id: user.id,
          name: user.name,
          username: user.username,
          email: user.email
        }));
        this.dataSource.data = this.users;
        this.isLoading = true;
      },
      error: (error)=>{

      }
    });
  }
  delet(id: number): void {
          this.udaService.deleteUser(id).subscribe({  
            next: (response) => {
              this.dataSource.data = this.dataSource.data.filter(user => user.id !== id);
              this.NotificationService.showSuccess('Usuario eliminado con exito', `El usuario ${id} fue borrado`); // Muestra la notificación de éxito
            },
            error: (error) => {
              console.log(error); 
            }
          });
      }
  openDialog(id_user:number): void{
      const dialogRef = this.dialog.open(DialogContentExampleDialog, {
        data: {id: id_user}
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.delet(result);
        }
      });
    }
}

@Component({
  selector: 'dialog-content-example-dialog',
  templateUrl: 'dialog-content-dialog.html',
  styleUrl: 'dialog-content-dialog.css',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialogContentExampleDialog {
  readonly dialogRef = inject(MatDialogRef<TableRComponent>);
  readonly data = inject<DialogData>(MAT_DIALOG_DATA);

  eliminar(id: number): void {
    this.dialogRef.close(id);
}
}