import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface ApiReservation {
  _id: string;
  buyer_id: any;
  farmer_id: any;
  listing_id: any;
  quantity_kg: number;
  unit_price: number;
  total_amount: number;
  payment_method: string;
  payment_status: string;
  status: string;
  pickup_schedule?: string;
  expiration_date?: string;
  notes?: string;
  created_at: string;
}

@Injectable({ providedIn: 'root' })
export class ReservationService {
  private base = `${environment.apiUrl}/reservations`;
  constructor(private http: HttpClient) {}

  create(payload: {
    listing_id: string; quantity_kg: number;
    payment_method: string; pickup_schedule?: string; notes?: string;
  }): Observable<{ reservation: ApiReservation }> {
    return this.http.post<any>(this.base, payload);
  }

  getMy(): Observable<{ reservations: ApiReservation[] }> {
    return this.http.get<any>(`${this.base}/my`);
  }

  getAll(): Observable<{ reservations: ApiReservation[] }> {
    return this.http.get<any>(this.base);
  }

  getById(id: string): Observable<{ reservation: ApiReservation }> {
    return this.http.get<any>(`${this.base}/${id}`);
  }

  updateStatus(id: string, status: string): Observable<{ reservation: ApiReservation }> {
    return this.http.patch<any>(`${this.base}/${id}/status`, { status });
  }
}
