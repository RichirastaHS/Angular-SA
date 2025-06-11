import { Component, Input } from '@angular/core';
import { TimeService } from '../../service/time.service';

interface DocumentHistory {
  id: number;
  name: string;
  key: string;
  created_at: string;
  updated_at: string | null;
}

interface DocumentDataHistory {
  id: string;
  title: string;
  reference_number: string;
  description: string;
  created_by: number;
  category_id: number;
  status_id: number;
  sender_department_id: number;
  receiver_department_id: number;
  issue_date: string;
  received_date: string;
  priority: string;
  created_at: string;
  updated_at: string | null;
  parent_id: string | null;
  status: DocumentHistory;
  children: DocumentDataHistory[]; // Recursivo para hijos
}
@Component({
  selector: 'app-d-history-changes',
  imports: [],
  templateUrl: './d-history-changes.component.html',
  styleUrl: './d-history-changes.component.css'
})
export class DHistoryChangesComponent {
 @Input() historyItem!: DocumentDataHistory;
  
  constructor(private time: TimeService) {}

getFormattedDate(date: string | null): string {
  return this.time.formatFullDate(date!);
}

getRelativeDate(date: string | null): string {
  return this.time.getRelativeTime(date!);
}
getStatusColor(status: string): string {
  const statusColors: Record<string, string> = {
    'Recepcionado': '#a0a0a0',
    'En Tramite': 'var(--color-theme-orange)',    
    'En Firma': 'purple',     
    'Firmado': 'var(--color-theme-light-blue)',     
    'Cancelado': 'var(--color-theme-red)',
    'Concluido': 'var(--color-theme-green)'
  };

  return statusColors[status] || '#95a5a6'; 
}
}
