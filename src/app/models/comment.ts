export interface usuario {
  id: number;
  name: string;
}
export interface Comment {
  id: number;
  comment: string;
  created_at: string;
  updated_at: string;
  parent_id: number | null;
  document_id: string;
  document: any | null;
  user_id: number;
  user: usuario;
  replies: Comment[];
}