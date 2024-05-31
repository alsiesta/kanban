import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { lastValueFrom, tap } from 'rxjs';
import { Task } from '../models/tasks.model';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class KanbanService {
  // Add a new Subject
  taskAdded = new Subject<void>();

  constructor (private http: HttpClient) { }

  public getTasks () {
    const url = environment.baseUrl + '/tasks/';
    return this.http.get<Task[]>(url);
  }


  public createTask (task: Task) {
    const url = `${environment.baseUrl}/tasks/`;
    return this.http.post<Task>(url, task).pipe(
      tap(() => {
        this.taskAdded.next();
      })
    );
  }

  public updateTask (id: number, task: Task) {
    console.log(task);
    const url = `${environment.baseUrl}/tasks/${id}/`;
    return this.http.put<Task>(url, task);
  }

  public updateTasks (tasks: Task[]) {
    const url = environment.baseUrl + '/tasks/bulk_update/';
    return this.http.put(url, tasks);
  }

  public getTaskById (id: number) {
    const url = `${environment.baseUrl}/tasks/${id}/`;
    return this.http.get<Task>(url);
  }

}

