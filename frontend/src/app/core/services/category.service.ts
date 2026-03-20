import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface ApiCategory {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image_url?: string;
}

@Injectable({ providedIn: 'root' })
export class CategoryService {
  private base = `${environment.apiUrl}/categories`;
  constructor(private http: HttpClient) {}

  getAll(): Observable<{ categories: ApiCategory[] }> {
    return this.http.get<any>(this.base);
  }
}
