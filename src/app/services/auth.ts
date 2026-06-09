import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';

const API = 'http://localhost:5177/api';

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(private http: HttpClient, private router: Router) {}

  login(email: string, password: string) {
    return this.http.post<{ token: string }>(`${API}/auth/login`, { email, password }).pipe(
      tap(res => localStorage.setItem('token', res.token))
    );
  }

  register(name: string, email: string, password: string, confirmPassword: string) {
    return this.http.post(`${API}/auth/register`, { name, email, password, confirmPassword });
  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

  getToken() {
    return localStorage.getItem('token');
  }

  isLoggedIn() {
    return !!this.getToken();
  }
}
