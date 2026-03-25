import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface ContactMessage {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export interface ContactResponse {
  success: boolean;
  total: number;
  unread: number;
  messages: ContactMessage[];
}

@Injectable({ providedIn: 'root' })
export class ContactService {
  private api = `${environment.apiUrl}/contacts`;

  constructor(private http: HttpClient) {}

  submit(data: { firstName: string; lastName: string; email: string; phone: string; message: string }): Observable<any> {
    return this.http.post(this.api, data);
  }

  getAll(): Observable<ContactResponse> {
    return this.http.get<ContactResponse>(this.api);
  }

  markRead(id: string): Observable<any> {
    return this.http.patch(`${this.api}/${id}/read`, {});
  }

  delete(id: string): Observable<any> {
    return this.http.delete(`${this.api}/${id}`);
  }
}
