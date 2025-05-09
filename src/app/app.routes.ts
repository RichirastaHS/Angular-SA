import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DocumentListComponent } from './layout/document-list/document-list.component';
import { AddDocumentComponent } from './layout/add-document/add-document.component';
import { ControlPanelComponent } from './layout/control-panel/control-panel.component';
import { DocumentDetailsComponent } from './layout/document-details/document-details.component';
import { MainComponent } from './layout/main/main.component';
import { EditDocumentComponent } from './layout/edit-document/edit-document.component';
import { LoginComponent } from './layout/login/login.component';
import { AuthGuard } from './core/guards/auth.guard';
import { ConfigurationComponent } from './layout/configuration/configuration.component';
import { DocumentfoundComponent } from './layout/documentfound/documentfound.component';
import { CreateNewUserComponent } from './layout/create-new-user/create-new-user.component';
import { TableUsersComponent } from './layout/table-users/table-users.component';

export const routes: Routes = [
    {
        path: '', redirectTo: 'login', pathMatch: 'full',
    },
    {
        path: 'login',
        component:LoginComponent
    },
    {
        path: 'main',
        component:MainComponent,
        canActivate: [AuthGuard],
        children: [
            {
                path: '', redirectTo: 'lista', pathMatch: 'full',
            },
            {
                path: 'lista',
                component:DocumentListComponent,
            },
            {
                path: 'detalles/:id',
                component:DocumentDetailsComponent,
            },
            {
                path: 'agregar',
                component:AddDocumentComponent,
                
            },
            {
                path: 'panel',
                component:ControlPanelComponent,
                
            }, 
            {
                path: 'editar/:id',
                component:EditDocumentComponent,
                
            },
            {
                path: 'configuracion',
                component: ConfigurationComponent,
            },
            {
                path: 'busqueda',
                component: DocumentfoundComponent,
            },
            {
                path: 'nuevo_usuario',
                component: CreateNewUserComponent,
            },
            {
                path: 'mas_detalles',
                component: TableUsersComponent,
            },
        ]
    },
];
