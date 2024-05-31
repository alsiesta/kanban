import { Component, OnDestroy } from '@angular/core';
import { KanbanService } from '../services/kanban.service';
import { Task } from '../models/tasks.model';
import { NavigationEnd, Router } from '@angular/router';
import { MatDialog, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { KanbanDialogComponent } from '../kanban-dialog/kanban-dialog.component';
import { KanganNewtaskComponent } from '../kangan-newtask/kangan-newtask.component';

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
  styleUrls: ['./kanban.component.scss'],
})


export class KanbanComponent implements OnDestroy {
  constructor (private kanbanService: KanbanService, private router: Router, public dialog: MatDialog) { }
  tasks: Task[] = [];
  initialTasksState: Task[] = [];
  initialTodo: string[] = [];
  initialInProgress: string[] = [];
  initialDone: string[] = [];

  todo = [''];
  done = [''];
  inprogress = [''];


  openDialog (taskId: string): void {
    this.kanbanService.getTaskById(Number(taskId)).subscribe(task => {
      this.dialog.open(KanbanDialogComponent, {
        width: '80vw',
        data: task
      });
    });
  }

  createTask (): void {

    this.dialog.open(KanganNewtaskComponent, {
      width: '80vw',
    });
  }


  ngOnInit() {
  this.fetchTasks();

  this.kanbanService.taskAdded.subscribe(() => {
    this.fetchTasks();
  });
}

fetchTasks() {
  this.kanbanService.getTasks().subscribe(tasks => {
    this.tasks = tasks;
    console.log(this.tasks);

    // Clear the arrays
    this.todo = [];
    this.done = [];
    this.inprogress = [];
    this.initTaskCards();
    this.initialTasksState = JSON.parse(JSON.stringify(this.tasks));

    // Store the initial state of the tasks
    this.initialTodo = [...this.todo];
    this.initialInProgress = [...this.inprogress];
    this.initialDone = [...this.done];

    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd && event.url.startsWith('/task-detail')) {
        if (this.needsUpdate()) {
          this.updateTasks();
        }
      }
    });
  });
}

  needsUpdate (): boolean {
    // Compare the initial state to the current state and return true if there are any differences
    return JSON.stringify(this.initialTodo) !== JSON.stringify(this.todo) ||
      JSON.stringify(this.initialInProgress) !== JSON.stringify(this.inprogress) ||
      JSON.stringify(this.initialDone) !== JSON.stringify(this.done);
  }

  updateTasks () {
    // Iterate over each array
    [this.todo, this.inprogress, this.done].forEach((statusArray, index) => {
      // For each task ID in the array
      statusArray.forEach((taskId, i) => {
        // Find the corresponding task in this.tasks
        const task = this.tasks.find(task => task.id?.toString() === taskId);
        if (task) {
          // Update its status
          task.status = ['T', 'I', 'D'][index];
          // Update its order
          task.order = i;
        }
      });
    });

    // Call a method on kanbanService to update the tasks on the backend
    this.kanbanService.updateTasks(this.tasks).subscribe(() => {
      console.log('Tasks updated');
    });
  }



initTaskCards () {
  // Iterate over the tasks and push them into the appropriate arrays
  for (let task of this.tasks) {
    if (task.id !== undefined) {
      switch (task.status) {
        case 'T':
          this.todo.push(task.id.toString());
          break;
        case 'I':
          this.inprogress.push(task.id.toString());
          break;
        case 'D':
          this.done.push(task.id.toString());
          break;
      }
    }
  }
}


  drop (event: CdkDragDrop<string[]>) {
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

    // Get the task that was dropped
    const taskId = event.item.data;

    const task = this.tasks.find(task => task.id?.toString() === taskId);

    if (task) {
      // Update the status based on the container where the task was dropped
      if (event.container.id === 'cdk-drop-list-0') {
        task.status = 'T';
      } else if (event.container.id === 'cdk-drop-list-1') {
        task.status = 'I';
      } else if (event.container.id === 'cdk-drop-list-2') {
        task.status = 'D';
      }

      // Update the task in the backend
      this.kanbanService.updateTask(task.id!, task).subscribe(
        response => {
          console.log(response);
        },
        error => {
          console.error(error);
        }
      );
    }
  }

  getColor(item: any): string {
    const task = this.getTaskById(item);
    switch (task?.color) {
        case 'G':
            return 'green';
        case 'Y':
            return 'yellow';
        case 'R':
            return 'red';
        default:
            return 'lightgrey';
    }
}

  getTaskById (id: string): Task | undefined {
    return this.tasks.find(task => task.id?.toString() === id);
  }

  ngOnDestroy () {
    if (this.needsUpdate()) {
      this.updateTasks();
    }
  }


}
