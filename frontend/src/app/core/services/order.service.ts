import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiTransaction } from './transaction.service';

export interface OrderItem {
  listing_id: string;
  quantity_kg: number;
}

export interface CreateOrderPayload {
  items: OrderItem[];
  payment_method: string;
  delivery_address: string;
  notes?: string;
}

@Injectable({ providedIn: 'root' })
export class OrderService {
  private base = `${environment.apiUrl}/orders`;
  constructor(private http: HttpClient) {}

  create(payload: CreateOrderPayload): Observable<{ transactions: ApiTransaction[]; count: number; message: string }> {
    return this.http.post<any>(this.base, payload);
  }

  getMy(): Observable<{ transactions: ApiTransaction[]; count: number }> {
    return this.http.get<any>(`${this.base}/my`);
  }

  getById(id: string): Observable<{ transaction: ApiTransaction }> {
    return this.http.get<any>(`${this.base}/${id}`);
  }

  cancel(id: string): Observable<any> {
    return this.http.patch(`${this.base}/${id}/cancel`, {});
  }
}
