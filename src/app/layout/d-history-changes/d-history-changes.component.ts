import { Component, Input } from '@angular/core';
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
  status: DocumentDataHistory;
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
  
}
