import { Component } from '@angular/core';
import { KanbanService } from '../services/kanban.service';
import { Task } from '../models/tasks.model';

import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
  CdkDrag,
  CdkDropList,
} from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-kanban',
  templateUrl: './kanban.component.html',
  styleUrls: ['./kanban.component.scss']
})
  
  
export class KanbanComponent {
  constructor (private kanbanService: KanbanService) { }
  tasks: Task[] = [];

  todo = [''];
  done = [''];
  inprogress = [''];

ngOnInit() {
  this.kanbanService.getTasks().subscribe(tasks => {
    this.tasks = tasks;
    console.log(this.tasks);

    // Clear the arrays
    this.todo = [];
    this.done = [];
    this.inprogress = [];

    // Iterate over the tasks and push them into the appropriate arrays
    for (let task of this.tasks) {
      switch (task.status) {
        case 'T':
          this.todo.push(task.title);
          break;
        case 'I':
          this.inprogress.push(task.title);
          break;
        case 'D':
          this.done.push(task.title);
          break;
      }
    }
  });
}


  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    }
  }
}
