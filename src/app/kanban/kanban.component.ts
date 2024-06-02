import { Component } from '@angular/core';
import { KanbanService } from '../services/kanban.service';

import { Task } from '../models/tasks.model';
import { MatDialog } from '@angular/material/dialog';
import { KanbanDialogComponent } from '../kanban-dialog/kanban-dialog.component';
import { KanbanNewtaskComponent } from '../kanban-newtask/kanban-newtask.component';
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

export class KanbanComponent {
  user: any;

  containerData: any;
  tasks: Task[] = [];
  initialTodo: string[] = [];
  initialInProgress: string[] = [];
  initialDone: string[] = [];

  todo: string[] = [];
  done: string[] = [];
  inprogress: string[] = [];
  error = '';

  constructor (
    private kanbanService: KanbanService,
    public dialog: MatDialog,
  ) { this.loadUser(); }

  ngOnInit () {
    this.fetchTasks();
    this.kanbanService.taskAdded.subscribe(() => { this.fetchTasks(); });
    this.kanbanService.taskUpdated.subscribe(() => { this.fetchTasks(); });
  }

  loadUser () {
    const user = localStorage.getItem('user');
    if (user) {
      this.user = JSON.parse(user);
      console.log('User:', this.user);
    }
  }

  fetchTasks () {
    this.kanbanService.getTasks().subscribe(tasks => {
      if (JSON.stringify(tasks) !== JSON.stringify(this.tasks)) {
        this.tasks = tasks;
        this.todo = [];
        this.done = [];
        this.inprogress = [];
        this.initTaskCards();
      }
    }, error => {
      this.error = 'Failed to fetch tasks';
      console.error(error);
    });
  }

  async handleApiCall (apiCall: Promise<any>, errorMessage: string) {
    try {
      return await apiCall;
    } catch (e) {
      this.error = errorMessage;
      console.error('Error:', e);
    }
  }

  openDialog (taskId: string): void {
    this.kanbanService.getTaskById(Number(taskId)).subscribe(task => {
      this.dialog.open(KanbanDialogComponent, {
        width: '80vw',
        data: task
      });
    });
  }

  createTask (): void {
    this.dialog.open(KanbanNewtaskComponent, {
      width: '80vw',
    });
  }

  updateTasks () {
    [this.todo, this.inprogress, this.done].forEach((statusArray, index) => {
      statusArray.forEach((taskId, i) => {
        const task = this.tasks.find(task => task.id?.toString() === taskId);
        if (task) {
          task.status = ['T', 'I', 'D'][index];
          task.order = i;
        }
      });
    });
    this.kanbanService.updateTasks(this.tasks).subscribe(() => {
    });
  }

  initTaskCards () {
    this.tasks.sort((a, b) => (a.order !== undefined ? a.order : Infinity) - (b.order !== undefined ? b.order : Infinity));
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
    const taskId = event.item.data;
    const task = this.tasks.find(task => task.id?.toString() === taskId);
    this.containerData = event.container.data;
    if (task) {
      if (event.container.id === 'cdk-drop-list-0') {
        task.status = 'T';
      } else if (event.container.id === 'cdk-drop-list-1') {
        task.status = 'I';
      } else if (event.container.id === 'cdk-drop-list-2') {
        task.status = 'D';
      }
      task.order = event.container.data.indexOf(taskId);
      this.updateTasks();
    }
  }

  getColor (item: any): string {
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
}