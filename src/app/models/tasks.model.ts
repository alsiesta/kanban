export interface Task {
  id: number;
  created_at: string;
  due_date: string;
  title: string;
  description: string;
  priority: string;
  status: string;
  color: string;
  user: number;
  subtask: string;
}
