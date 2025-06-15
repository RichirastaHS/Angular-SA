import { Component, Input } from '@angular/core';
import { TimeService } from '../../service/time.service';
import { DocumentDataHistory } from '../../models/docdatahistory';

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
