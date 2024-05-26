import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { lastValueFrom } from 'rxjs';
import { Task } from '../models/tasks.model';

@Injectable({
  providedIn: 'root'
})
export class KanbanService {

  constructor (private http: HttpClient) { }

public getTasks () {
    const url = environment.baseUrl + '/tasks/';
    return this.http.get<Task[]>(url);
}
}
