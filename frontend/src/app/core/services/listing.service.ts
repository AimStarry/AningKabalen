import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface ApiListing {
  _id: string;
  farmer_id: { _id: string; name: string; avatar_url?: string; farm_details?: any; rating: any; phone?: string };
  category_id: { _id: string; name: string; slug: string };
  crop_name: string;
  variety?: string;
  description: string;
  quantity: number;
  quantity_kg: number;
  available_kg: number;
  price_per_kg: number;
  unit: string;
  images: string[];
  tags: string[];
  status: string;
  harvest_date?: string;
  created_at: string;
}

@Injectable({ providedIn: 'root' })
export class ListingService {
  private base = `${environment.apiUrl}/listings`;

  constructor(private http: HttpClient) {}

  getAll(params: Record<string, any> = {}): Observable<{ listings: ApiListing[]; total: number }> {
    let p = new HttpParams();
    Object.entries(params).forEach(([k, v]) => { if (v != null && v !== '') p = p.set(k, v); });
    return this.http.get<any>(this.base, { params: p });
  }

  getById(id: string): Observable<{ listing: ApiListing }> {
    return this.http.get<any>(`${this.base}/${id}`);
  }

  getByFarmer(farmerId: string): Observable<{ listings: ApiListing[] }> {
    return this.http.get<any>(`${this.base}/farmer/${farmerId}`);
  }

  getMyListings(): Observable<{ listings: ApiListing[] }> {
    return this.http.get<any>(`${this.base}/my`);
  }

  create(data: FormData): Observable<{ listing: ApiListing }> {
    return this.http.post<any>(this.base, data);
  }

  update(id: string, data: FormData | object): Observable<{ listing: ApiListing }> {
    return this.http.patch<any>(`${this.base}/${id}`, data);
  }

  updateStatus(id: string, status: string): Observable<{ listing: ApiListing }> {
    return this.http.patch<any>(`${this.base}/${id}/status`, { status });
  }

  delete(id: string): Observable<any> {
    return this.http.delete(`${this.base}/${id}`);
  }
}