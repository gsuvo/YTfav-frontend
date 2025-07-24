import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { environment } from '../../../../environments/environment.prod';

@Injectable({ providedIn: 'root' })
export class AuthService {
  resetPassword(token: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/reset-password`, { token, password });
  }
  private apiUrl = environment.apiUrl;
  private userSubject = new BehaviorSubject<any>(null);
  user$ = this.userSubject.asObservable();

  constructor(private http: HttpClient) {
    // TEMP: Log para depuración en producción
    console.log('API URL en producción:', this.apiUrl);
    // Si hay token, cargar usuario al iniciar
    const token = this.getToken();
    if (token) {
      this.getCurrentUser(token).subscribe({
        next: user => this.userSubject.next(user),
        error: () => this.userSubject.next(null)
      });
    }
  }

  register(data: { username: string; email: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/register`, data);
  }

  login(data: { email: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/login`, data);
  }

  getCurrentUser(token: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }
  recoverPassword(email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/forgot-password`, { email });
  }

  saveToken(token: string) {
    localStorage.setItem('token', token);
    // Actualizar usuario al guardar token
    this.getCurrentUser(token).subscribe({
      next: user => this.userSubject.next(user),
      error: () => this.userSubject.next(null)
    });
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  logout() {
    localStorage.removeItem('token');
    this.userSubject.next(null);
  }
}
