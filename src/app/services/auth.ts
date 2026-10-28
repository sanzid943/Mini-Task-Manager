
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

import { API_URL } from '../api-url';
import {
  LoginRequest,
  LoginResponse,
  RegisterRequest
} from '../models/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);

  private readonly tokenKey = 'miniTaskManagerToken';

  register(data: RegisterRequest): Observable<unknown> {
    return this.http.post(
      `${API_URL}/auth/register`,
      data
    );
  }

  login(data: LoginRequest): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(
        `${API_URL}/auth/login`,
        data
      )
      .pipe(
        tap(response => {
          localStorage.setItem(
            this.tokenKey,
            response.token
          );
        })
      );
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
  }
}