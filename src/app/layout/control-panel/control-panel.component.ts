import { Component } from '@angular/core';
import { UdaService } from '../../service/uda.service';
import { User } from '../../models/user';
import { Router, RouterLink } from '@angular/router';

export interface activities{
  id: number;
  action: string;
  changes: string; // JSON en formato string doblemente escapado
  created_at: string;
  updated_at: string;
  description: string;
  document_id: string;
  document_name: string;
  model_type: string;
  read_by_admin: number;
  user_id: number;
  user_name: string;
  parsedChanges?: {
    title: string;
    status_id: number;
  };
}

@Component({
  selector: 'app-control-panel',
  imports: [RouterLink],
  templateUrl: './control-panel.component.html',
  styleUrl: './control-panel.component.css'
})
export class ControlPanelComponent {
  totalDocuments: number = 0;
  users: User[] = [];
  activities: activities[] = [];
  statusCounts: {
    status_id: number;
    total: number;
    status: {
      id: number;
      name: string;
    };
  }[] = [];

  constructor(
    private udaService: UdaService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.udaService.dashboard().subscribe({
      next: (response) => {
        this.totalDocuments = response.totalDocuments;
        this.users = response.users;
        this.statusCounts = response.statusCounts;
        this.activities = response.activities;
        console.log(this.activities)
      }, 
      error: (error) => {
      }
    })
  }
  getStatusLabel(statusName: string): string {
    const labels: { [key: string]: string } = {
      'Recepcionado': 'En recepción',
      'En Tramite': 'Documentos En Tramite',
      'En Firma': 'En firma',
      'Entregado': 'Entregados',
      'Cancelado': 'Cancelados',
      'Concluido': 'Concluidos',
    };
  
    return labels[statusName] || statusName;
  }

  showdetails(){
    this.router.navigate(['/main/mas_detalles']);
  }

  addNewUser(){
    this.router.navigate(['/main/nuevo_usuario']);
  }
}
