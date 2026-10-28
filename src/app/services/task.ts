import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { API_URL } from '../api-url';
import { Task, TaskCreate, TaskUpdate } from '../models/task';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private http = inject(HttpClient);

  private readonly tasksUrl = `${API_URL}/tasks`;

  getMyTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(this.tasksUrl);
  }

  getTask(id: number): Observable<Task> {
    return this.http.get<Task>(`${this.tasksUrl}/${id}`);
  }

  createTask(data: TaskCreate): Observable<Task> {
    return this.http.post<Task>(this.tasksUrl, data);
  }

  updateTask(id: number, data: TaskUpdate): Observable<Task> {
    return this.http.put<Task>(`${this.tasksUrl}/${id}`, data);
  }

  deleteTask(id: number): Observable<unknown> {
    return this.http.delete(`${this.tasksUrl}/${id}`);
  }
}