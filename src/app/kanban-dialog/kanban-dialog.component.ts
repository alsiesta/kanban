import { Component, Inject } from '@angular/core';
import { MatDialogRef,MAT_DIALOG_DATA } from '@angular/material/dialog';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { KanbanService } from '../services/kanban.service';
import { Task } from '../models/tasks.model';
export interface DialogData {
  id: number;
  created_at: Date;
  due_date: Date;
  title: string;
  description: string;
  priority: string;
  status: string;
  color: string;
  user: number;
  subtask: string;
  order: number;
}

@Component({
  selector: 'app-kanban-dialog',
  templateUrl: './kanban-dialog.component.html',
  styleUrls: ['./kanban-dialog.component.scss']
})
export class KanbanDialogComponent {
  task: Task = {
    id: 0,
    created_at: new Date(),
    due_date: new Date(),
    title: '',
    description: '',
    priority: '',
    status: '',
    color: '',
    user: 0,
    subtask: '',
    order: 0
  };
  
  editMode = false;
  editMade = false;

  constructor (private kanbanService: KanbanService,
    public dialogRef: MatDialogRef<KanbanDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
  ) { }

  ngOnInit () {
    this.task = this.data;
  }

  checkChanges (task:Task) {
    this.editMade = true;
  }

  deleteTask (task: Task) {
    this.kanbanService.deleteTask(task.id!).subscribe(
      response => {
        console.log('Task was deleted: ', response);
      },
      error => {
        console.error(error);
      }
    );
  }

  saveChanges (task:Task) {
    this.editMade = true;
    this.kanbanService.updateTask(task.id!, task).subscribe(
      response => {
        console.log('DB was updated: ',response);
      },
      error => {
        console.error(error);
      }
    );
  }
  
  getStatus (status: string): string {
    switch (status) {
      case 'T':
        return 'To Do';
      case 'I':
        return 'In Progress';
      case 'D':
        return 'Done';
      default:
        return status;
    }  
  }


  getColor(color: string): string {
    switch (color) {
      case 'G':
        return 'Green';
      case 'Y':
        return 'Yellow';
      case 'R':
        return 'Red';
      default:
        return color;
    }
  }


  getPrio(prio: string): string {
    switch (prio) {
      case 'L':
        return 'Low';
      case 'M':
        return 'Medium';
      case 'H':
        return 'High';
      default:
        return prio;
    }
  }
}
