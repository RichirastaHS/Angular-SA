export interface Category {
  id: number;
  name: string; //este 2 
}

export interface Status {
  id: number;
  name: string; //este es el estatus
}

export interface Document {
  id: number;
  title: string; //este 1 nombre
  description: string;
  category_id: number;
  category: Category; //este 2 tipo de doc 
  status_id: number;
  status: Status; //5 estatus
  received_date: Date; //este 4 fecha de recepcion
  created_at: Date; //este 3 fecha de creacion
  updated_at: Date; 
  created_by: number;
}

export interface Comment {
  id: number;
  text: string;
  created_at: string;
}

export interface ApiResponse {
  document: Document;
  comments: any[];
}

  /*
  export interface Document {
    id: number;
    category: Category;
    category_id: number;
    created_at: string;
    created_by: number;
    description: string;
    received_date: string;
    status: Status;
    status_id: number;
    title: string;
    updated_at: string;
  }
*/
  /*
  export interface Document {
    id: number;
    category: Category;
    category_id: number;
    created_at: string;
    created_by: number;
    description: string;
    received_date: string;
    status: Status;
    status_id: number;
    title: string;
    updated_at: string;
  }
*/