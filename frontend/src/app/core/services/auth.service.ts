import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface User {
  _id: string;
  name: string;
  email: string;
  phone: string;
  role: 'farmer' | 'buyer' | 'admin';
  avatar_url?: string;
  is_verified: boolean;
  verification_status: string;
  farm_details?: {
    farm_name: string;
    farm_size_hectares: number;
    years_farming: number;
    primary_crops: string[];
    certifications: string[];
  };
  buyer_details?: {
    business_name?: string;
    business_type: string;
  };
  rating: { average: number; count: number };
}

interface AuthResponse {
  success: boolean;
  token: string;
  user: User;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private base = `${environment.apiUrl}/auth`;
  private TOKEN_KEY = 'ak_token';
  private USER_KEY  = 'ak_user';

  user = signal<User | null>(this.loadUser());

  constructor(private http: HttpClient, private router: Router) {}

  register(payload: {
    name: string; email: string; phone: string;
    password: string; role: string;
    farm_details?: any; buyer_details?: any;
  }): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.base}/register`, payload)
      .pipe(tap(r => this.store(r)));
  }

  login(email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.base}/login`, { email, password })
      .pipe(tap(r => this.store(r)));
  }

  getMe(): Observable<{ user: User }> {
    return this.http.get<{ user: User }>(`${this.base}/me`)
      .pipe(tap(r => { this.user.set(r.user); localStorage.setItem(this.USER_KEY, JSON.stringify(r.user)); }));
  }

  updateProfile(data: FormData | object): Observable<{ user: User }> {
    return this.http.patch<{ user: User }>(`${this.base}/me`, data)
      .pipe(tap(r => { this.user.set(r.user); localStorage.setItem(this.USER_KEY, JSON.stringify(r.user)); }));
  }

  changePassword(currentPassword: string, newPassword: string): Observable<any> {
    return this.http.patch(`${this.base}/me/password`, { currentPassword, newPassword });
  }

  logout() {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.user.set(null);
    this.router.navigate(['/login']);
  }

  getToken(): string | null { return localStorage.getItem(this.TOKEN_KEY); }
  isLoggedIn(): boolean     { return !!this.getToken(); }
  currentUser(): User | null { return this.user(); }

  private store(r: AuthResponse) {
    localStorage.setItem(this.TOKEN_KEY, r.token);
    localStorage.setItem(this.USER_KEY,  JSON.stringify(r.user));
    this.user.set(r.user);
  }
  private loadUser(): User | null {
    const s = localStorage.getItem(this.USER_KEY);
    return s ? JSON.parse(s) : null;
  }
}
