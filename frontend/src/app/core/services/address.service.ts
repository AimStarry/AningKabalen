import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface ApiAddress {
  _id: string;
  label: string;
  street: string;
  barangay: string;
  municipality: string;
  province: string;
  region: string;
  zip_code: string;
  is_default: boolean;
}

@Injectable({ providedIn: 'root' })
export class AddressService {
  private base = `${environment.apiUrl}/addresses`;
  constructor(private http: HttpClient) {}

  getAll(): Observable<{ addresses: ApiAddress[] }> { return this.http.get<any>(this.base); }
  create(data: Partial<ApiAddress>): Observable<{ address: ApiAddress }> { return this.http.post<any>(this.base, data); }
  update(id: string, data: Partial<ApiAddress>): Observable<{ address: ApiAddress }> { return this.http.patch<any>(`${this.base}/${id}`, data); }
  delete(id: string): Observable<any> { return this.http.delete(`${this.base}/${id}`); }
}
