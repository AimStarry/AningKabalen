import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export interface ApiNotification {
  _id: string;
  type: string;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private base = `${environment.apiUrl}/notifications`;
  unreadCount = signal(0);
  constructor(private http: HttpClient) {}

  getAll() {
    return this.http.get<any>(this.base).pipe(
      tap((r: any) => this.unreadCount.set(r.unread))
    );
  }

  markRead(id: string) {
    return this.http.patch(`${this.base}/${id}/read`, {}).pipe(
      tap(() => this.unreadCount.update(n => Math.max(0, n - 1)))
    );
  }

  markAllRead() {
    return this.http.patch(`${this.base}/read-all`, {}).pipe(
      tap(() => this.unreadCount.set(0))
    );
  }
}
