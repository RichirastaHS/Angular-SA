import { Component } from '@angular/core';
import { UdaService } from '../../service/uda.service';
import { User } from '../../models/user';

@Component({
  selector: 'app-control-panel',
  imports: [],
  templateUrl: './control-panel.component.html',
  styleUrl: './control-panel.component.css'
})
export class ControlPanelComponent {
  totalDocuments: number = 0;
  users: User[] = [];
  statusCounts: {
    status_id: number;
    total: number;
    status: {
      id: number;
      name: string;
    };
  }[] = [];

  constructor(
    private udaService: UdaService
  ) { }

  ngOnInit(): void {
    this.udaService.dashboard().subscribe({
      next: (response) => {
        this.totalDocuments = response.totalDocuments;
        this.users = response.users;
        this.statusCounts = response.statusCounts;
        console.log(this.totalDocuments, this.users, this.statusCounts)
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
  // Add any methods or properties needed for the control panel functionality
}
