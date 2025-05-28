import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { UdaService } from '../../service/uda.service';
import { Router } from '@angular/router';
import {
  FormArray,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MatDialogTitle,
  MatDialogContent,
  MatDialogActions,
  MatDialogClose,
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialog,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { NotificationService } from '../../service/notification.service';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';

export interface DialogData {
  id: string;
  name: string;
}

export interface usuario {
  id: number;
  name: string;
  username: string;
}

interface Department {
  id: number;
  name: string;
}

interface profileUser {
  id: number;
  name: string;
  username: string;
  department: Department;
  permissions: string[];
  profile_photo: string;
  roles: string[];
}
export interface User {
  name: string;
  username: string;
  password: string;
  role: string;
  permissions: Array<string>;
}

export const openClose = trigger('openClose', [
  state(
    'open',
    style({
      height: '*',
      opacity: 1,
      overflow: 'hidden',
    })
  ),
  state(
    'closed',
    style({
      height: '*',
      opacity: 0.8,
      overflow: 'hidden',
    })
  ),
  transition('void => open', [
    style({ height: '0', opacity: 0 }),
    animate('400ms ease-out'),
  ]),
  transition('open => closed', [
    animate('400ms ease-in', style({ height: '0', opacity: 0 })),
  ]),
  transition('closed => open', [animate('400ms ease-out')]),
]);
@Component({
  selector: 'app-table-users',
  imports: [MatTableModule, MatPaginatorModule, ReactiveFormsModule],
  templateUrl: './table-users.component.html',
  styleUrl: './table-users.component.css',
  animations: [openClose],
})
export class TableUsersComponent {
  constructor(
    private udaService: UdaService,
    private NotificationService: NotificationService,
    private router: Router
  ) {}
  permissionslist : { [key: string]: string } = {
  create: 'Crear',
  read: 'Leer',
  update: 'Actualizar',
  delete: 'Eliminar'
};
permisosKeys = Object.keys(this.permissionslist);

  userForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.maxLength(255)]),
    username: new FormControl('', [
      Validators.required,
      Validators.maxLength(255),
    ]),
    new_password: new FormControl('', [Validators.maxLength(255)]),
    new_password_confirmation: new FormControl('', Validators.maxLength(255)),
    admin_password: new FormControl('', [Validators.maxLength(255)]),
    role: new FormControl('', [Validators.required, Validators.maxLength(255)]), //
    permissions: new FormArray([], [Validators.required]),
  });

  profileisview: boolean = false;
  userisedit: boolean = false;
  profile!: profileUser;
  isLoading = false;
  columnsToDisplay = ['Nombre', 'Alias', 'Acciones'];
  users: usuario[] = [];
  dataSource = new MatTableDataSource<usuario>();
  readonly dialog = inject(MatDialog);
  isOpen = false;

  ngOnInit() {
    this.getListUsers();
  }
  getListUsers() {
    this.udaService.getUsers().subscribe({
      next: (response) => {
        this.users = response.map((user: any) => ({
          id: user.id,
          name: user.name,
          username: user.username,
        }));
        this.dataSource.data = this.users;
        this.isLoading = true;
      },
      error: (error) => {
        this.router.navigate(['/main']);
      },
    });
  }

  delet(id: number): void {
    this.udaService.deleteUser(id).subscribe({
      next: (response) => {
        this.dataSource.data = this.dataSource.data.filter(
          (user) => user.id !== id
        );
        this.NotificationService.showSuccess(
          'Usuario eliminado con exito',
          `El usuario ${id} fue borrado`
        ); // Muestra la notificación de éxito
      },
      error: (error) => {},
    });
  }
  getUserData(id: number) {
    this.userisedit = false;
    this.isOpen = false;
    if (id) {
      this.udaService.infoUser(+id).subscribe({
        next: (response) => {

          this.profile = response;
          this.profileisview = true;
          this.isOpen = true;
        },
        error: (error) => {
          this.router.navigate(['/main/mas_detalles']);
        },
      });
    } else {
      this.router.navigate(['/main/mas_detalles']);
    }
  }

  editUser(id: number) {
    this.userisedit = true;
    this.userForm.patchValue({
      name: this.profile.name,
      username: this.profile.username,
      role: "user"
    });
    this.setPermisosSeleccionados(this.profile.permissions);
  }

  setPermisosSeleccionados(permisos: string[]) {
  const permisosFormArray = this.userForm.get('permissions') as FormArray;
  permisosFormArray.clear(); // Limpiar primero

  permisos.forEach(permiso => {
    permisosFormArray.push(new FormControl(permiso));
  });
}

  returnUserData() {
    this.userisedit = false;
  }
  openDialog(id_user: number, name: string): void {
    const dialogRef = this.dialog.open(DialogContentExampleDialog, {
      data: {
        id: id_user,
        name: name,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.delet(result);
      }
    });
  }

  traducirPermiso(permiso: string): string {
  switch (permiso) {
    case 'create': return 'Crear';
    case 'read': return 'Leer';
    case 'update': return 'Actualizar';
    case 'delete': return 'Eliminar';
    default: return permiso;
  }
}

  onSubmit(id: number): void {
    if (id) {
      const formData = { ...this.userForm.value };

      // Si no hay nueva contraseña, eliminamos esos campos
      if (!formData.new_password) {
        delete formData.new_password;
        delete formData.new_password_confirmation;
        delete formData.admin_password;
      }

      this.udaService.editUser(+id, formData).subscribe({
        next: (response) => {
          this.NotificationService.showSuccess(
            'Usuario editado correctamente',
            '¡Éxito!'
          );
          this.userisedit = false;
        },
        error: (error) => {
          const errorMessage = this.getFirstErrorMessage(error);
          this.NotificationService.showError(
            errorMessage,
            '¡Oh no! Ocurrió un error inesperado'
          );
        },
      });
    }
  }
  getFirstErrorMessage(error: any): string {
    if (error?.error?.errors) {
      const errors = error.error.errors;
      // Obtener el primer campo que tenga errores
      const firstErrorField = Object.keys(errors)[0];
      // Obtener el primer mensaje de error de ese campo
      const firstErrorMessage = errors[firstErrorField][0];
      return firstErrorMessage;
    }
    return 'Ocurrió un error desconocido';
  }
  onCheckboxChange(event: any) {
  const formArray: FormArray = this.userForm.get('permissions') as FormArray;

  if (event.target.checked) {
    formArray.push(new FormControl(event.target.value));
  } else {
    const index = formArray.controls.findIndex(
      x => x.value === event.target.value
    );
    if (index !== -1) {
      formArray.removeAt(index);
    }
  }
}
isChecked(permiso: string): boolean {
  const formArray = this.userForm.get('permissions') as FormArray;
  return formArray.value.includes(permiso);
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
  readonly dialogRef = inject(MatDialogRef<TableUsersComponent>);
  readonly data = inject<DialogData>(MAT_DIALOG_DATA);

  eliminar(id: number): void {
    this.dialogRef.close(id);
  }
}
