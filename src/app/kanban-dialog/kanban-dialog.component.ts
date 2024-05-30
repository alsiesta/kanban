import { Component, Inject } from '@angular/core';
import { MatDialogRef,MAT_DIALOG_DATA } from '@angular/material/dialog';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';

export interface DialogData {
  id: string;
  created_at: string;
  due_date: string;
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
  task: any;


  constructor (
    public dialogRef: MatDialogRef<KanbanDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
  ) { }

  ngOnInit () {
    this.task = this.data;
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
