import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { User } from './auth.service';

@Injectable({ providedIn: 'root' })
export class UserService {
  private base = `${environment.apiUrl}/users`;
  constructor(private http: HttpClient) {}

  getAll(params: any = {}): Observable<{ users: User[]; total: number }> {
    return this.http.get<any>(this.base, { params });
  }

  getFarmers(params: any = {}): Observable<{ farmers: User[] }> {
    return this.http.get<any>(`${this.base}/farmers`, { params });
  }

  getById(id: string): Observable<{ user: User }> {
    return this.http.get<any>(`${this.base}/${id}`);
  }

  updateVerification(id: string, status: string): Observable<{ user: User }> {
    return this.http.patch<any>(`${this.base}/${id}/verify`, { status });
  }

  deactivate(id: string): Observable<any> {
    return this.http.patch(`${this.base}/${id}/deactivate`, {});
  }
}
