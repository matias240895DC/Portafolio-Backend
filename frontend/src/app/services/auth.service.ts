import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, tap, throwError, catchError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = '/api/auth';
  private currentUserSubject = new BehaviorSubject<any>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {
    const user = localStorage.getItem('user');
    if (user) this.currentUserSubject.next(JSON.parse(user));
  }

  login(credentials: any) {
    return this.http.post<any>(`${this.apiUrl}/login`, credentials).pipe(
      tap(res => {
        localStorage.setItem('token', res.access_token);
        localStorage.setItem('refresh_token', res.refresh_token);
        localStorage.setItem('user', JSON.stringify(res.user));
        this.currentUserSubject.next(res.user);
      })
    );
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  refreshToken() {
    const userJson = localStorage.getItem('user');
    const refreshToken = localStorage.getItem('refresh_token');
    
    if (!userJson || !refreshToken) {
      this.logout();
      return throwError(() => new Error('No refresh token available'));
    }

    const user = JSON.parse(userJson);
    return this.http.post<any>(`${this.apiUrl}/refresh`, { 
      userId: user.id || user._id, 
      refreshToken 
    }).pipe(
      tap(res => {
        localStorage.setItem('token', res.access_token);
      }),
      catchError(err => {
        this.logout();
        return throwError(() => err);
      })
    );
  }

  get token() {
    return localStorage.getItem('token');
  }

  isLoggedIn() {
    return !!this.token;
  }
}
