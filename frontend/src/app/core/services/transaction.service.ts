import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface ApiTransaction {
  _id: string;
  buyer_id: any;
  farmer_id: any;
  listing_id: any;
  type: string;
  quantity_kg: number;
  unit_price: number;
  subtotal: number;
  platform_fee: number;
  total_amount: number;
  payment_method: string;
  payment_status: string;
  status: string;
  pickup_date?: string;
  notes?: string;
  created_at: string;
}

@Injectable({ providedIn: 'root' })
export class TransactionService {
  private base = `${environment.apiUrl}/transactions`;
  constructor(private http: HttpClient) {}

  getAll(): Observable<{ transactions: ApiTransaction[]; total: number }> {
    return this.http.get<any>(this.base);
  }

  getMy(): Observable<{ transactions: ApiTransaction[] }> {
    return this.http.get<any>(`${this.base}/my`);
  }

  getStats(): Observable<any> {
    return this.http.get<any>(`${this.base}/stats`);
  }

  updateStatus(id: string, status: string): Observable<{ transaction: ApiTransaction }> {
    return this.http.patch<any>(`${this.base}/${id}/status`, { status });
  }
}
