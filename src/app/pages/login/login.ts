import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.component.html'
})
export class LoginComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  username = '';
  password = '';
  errorMessage = '';
  loading = false;

  login(): void {
    this.errorMessage = '';

    if (!this.username.trim() || !this.password) {
      this.errorMessage = 'Username and password are required.';
      return;
    }

    this.loading = true;

    this.authService.login({
      username: this.username.trim(),
      password: this.password
    }).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/tasks']);
      },
      error: err => {
        this.loading = false;
        this.errorMessage =
          err.status === 401
            ? 'Invalid username or password.'
            : 'Login failed. Check whether the backend is running.';
      }
    });
  }
}