export interface Category {
    id: number;
    name: string;
  }
  
  export interface Status {
    id: number;
    name: string;
  }
  
  export interface Department {
    id: number;
    name: string;
  }
  
  export interface DocumentFormModel {
    categories: Category[];
    statuses: Status[];
    senders_department: Department[];
    receivers_department: Department[];
  }
  
  export const documentFormData: DocumentFormModel = {
    categories: [],
    statuses: [],
    senders_department: [],
    receivers_department: []
  };
  