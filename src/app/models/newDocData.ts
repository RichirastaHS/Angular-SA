export interface DocumentCreate {
    title: string;
    reference_number: string;
    category: number;
    status: number;
    sender_department: number;
    receiver_department?: number;
    issue_date: string;      
    received_date: string;  
    description?: string;
    priority: number;
  }