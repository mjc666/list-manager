export interface List {
  id: number;
  name: string;
  created_at: Date;
}

export interface Item {
  id: number;
  list_id: number;
  content: string;
  is_completed: boolean;
  created_at: Date;
}