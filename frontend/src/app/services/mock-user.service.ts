import { Injectable } from '@angular/core';
import { User } from '@shared/models';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class MockUserService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  private mockUsers: User[] = [
    {
      uid: 'f1',
      name: 'Mang Juan',
      role: 'Farmer',
      address: ['123', 'Main St', 'San Fernando', 'Pampanga'],
      contact_no: '09123456789',
      is_verified: true
    },
    {
      uid: 'b1',
      name: 'Chef Mario',
      role: 'Buyer',
      address: ['456', 'Service Rd', 'Angeles', 'Pampanga'],
      contact_no: '09987654321',
      is_verified: true
    }
  ];

  async login(email: string): Promise<User | null> {
    const user = email === 'farmer@test.com' ? this.mockUsers[0] : this.mockUsers[1];
    this.currentUserSubject.next(user);
    return Promise.resolve(user);
  }

  async logout(): Promise<void> {
    this.currentUserSubject.next(null);
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }
}