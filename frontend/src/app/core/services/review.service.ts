import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ReviewService {
  private base = `${environment.apiUrl}/reviews`;
  constructor(private http: HttpClient) {}

  getByTarget(targetId: string): Observable<{ reviews: any[] }> {
    return this.http.get<any>(`${this.base}/target/${targetId}`);
  }

  create(payload: { target_id: string; target_type: string; rating: number; comment?: string }): Observable<any> {
    return this.http.post<any>(this.base, payload);
  }
}
