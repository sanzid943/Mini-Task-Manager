import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../../services/auth';
import { TaskService } from '../../services/task';
import { Task } from '../../models/task';

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './tasks.component.html'
})
export class TasksComponent implements OnInit {
  private taskService = inject(TaskService);
  private authService = inject(AuthService);
  private router = inject(Router);

  tasks: Task[] = [];

  title = '';
  description = '';

  editingId: number | null = null;
  editingCompleted = false;

  errorMessage = '';
  successMessage = '';
  loading = false;

  ngOnInit(): void {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }

    this.loadTasks();
  }

  loadTasks(): void {
    this.errorMessage = '';
    this.loading = true;

    this.taskService.getMyTasks().subscribe({
      next: data => {
        this.tasks = data;
        this.loading = false;
      },
      error: err => {
        this.loading = false;

        if (err.status === 401) {
          this.authService.logout();
          this.router.navigate(['/login']);
        } else {
          this.errorMessage =
            'Could not load tasks. Check the API connection.';
        }
      }
    });
  }

  saveTask(): void {
    this.errorMessage = '';
    this.successMessage = '';

    if (!this.title.trim()) {
      this.errorMessage = 'Task title is required.';
      return;
    }

    if (this.title.trim().length > 100) {
      this.errorMessage = 'Title cannot exceed 100 characters.';
      return;
    }

    if (this.description.length > 500) {
      this.errorMessage = 'Description cannot exceed 500 characters.';
      return;
    }

    const data = {
      title: this.title.trim(),
      description: this.description.trim()
    };

    if (this.editingId === null) {
      this.taskService.createTask(data).subscribe({
        next: () => {
          this.successMessage = 'Task created successfully.';
          this.resetForm();
          this.loadTasks();
        },
        error: () => {
          this.errorMessage = 'Could not create task.';
        }
      });
    } else {
      this.taskService.updateTask(this.editingId, {
        ...data,
        isCompleted: this.editingCompleted
      }).subscribe({
        next: () => {
          this.successMessage = 'Task updated successfully.';
          this.resetForm();
          this.loadTasks();
        },
        error: () => {
          this.errorMessage = 'Could not update task.';
        }
      });
    }
  }

  editTask(task: Task): void {
    this.editingId = task.id;
    this.title = task.title;
    this.description = task.description;
    this.editingCompleted = task.isCompleted;
    this.errorMessage = '';
    this.successMessage = '';
  }

  deleteTask(id: number): void {
    if (!confirm('Are you sure you want to delete this task?')) {
      return;
    }

    this.taskService.deleteTask(id).subscribe({
      next: () => {
        this.successMessage = 'Task deleted successfully.';
        this.loadTasks();
      },
      error: () => {
        this.errorMessage = 'Could not delete task.';
      }
    });
  }

  resetForm(): void {
    this.title = '';
    this.description = '';
    this.editingId = null;
    this.editingCompleted = false;
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}