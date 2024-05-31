import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { KanbanService } from '../services/kanban.service';
import { Task } from '../models/tasks.model';

@Component({
  selector: 'app-kanban-newtask',
  templateUrl: './kanban-newtask.component.html',
  styleUrls: ['./kanban-newtask.component.scss']
})
export class KanbanNewtaskComponent {
  taskForm = new FormGroup({
    title: new FormControl(''),
    due_date: new FormControl(''),
    description: new FormControl(''),
    priority: new FormControl(''),
    status: new FormControl('T'),
    color: new FormControl(''),
    user: new FormControl(''),
    subtask: new FormControl(''),
    order: new FormControl(''),
    created_at: new FormControl(''),
    id: new FormControl('')
  });

  constructor (private cdr: ChangeDetectorRef, private kanbanService: KanbanService) { }

  ngOnInit () {
    this.cdr.detectChanges();
  }
 
  
  onSubmit(formData: any) {

  const created_at = new Date();
  const order = 0;
  const dueDate = formData.due_date ? new Date(formData.due_date) : undefined;
  // const user = formData.user ? Number(formData.user) : undefined;
  // const subtask = formData.subtask ? String(formData.subtask) : undefined;
  // const title = formData.title ? String(formData.title) : '';
    
  const taskData: Task = {
    ...formData,
    created_at: created_at,
    order: order,
    due_date: dueDate,
  };

  this.kanbanService.createTask(taskData).subscribe(
    response => {
      console.log(response);
    },
    error => {
      console.error(error);
    }
  );
}

}
