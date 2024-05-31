export interface Task {
  id?: number;
  created_at?: Date;
  due_date?: Date;
  title: string;
  description?: string;
  priority?: string;
  status?: string;
  color?: string;
  user?: number;
  subtask?: string;
  order?: number;
}
