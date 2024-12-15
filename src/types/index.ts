export interface Entry {
  id: string;
  name: string;
  products?: string;
  value: number;
  status: 'new' | 'pending' | 'closed' | 'dropped';
  createdAt: string;
  userId: string;
}

export interface DragItem {
  id: string;
  type: string;
  status: Entry['status'];
}