// client/src/app/services/mock-reservation.service.ts
import { Injectable } from '@angular/core';
import { Reservation } from '@shared/models';
import { MockListingService } from './mock-listing.service';

@Injectable({ providedIn: 'root' })
export class MockReservationService {
  
  private reservations: Reservation[] = [
    {
      res_id: 'res-001',
      listing_id: 'l1',
      buyer_id: 'b1',
      pledge_status: 'Pending'
    }
  ];

  constructor(private listingService: MockListingService) {}

  async getBuyerReservations(buyerId: string): Promise<Reservation[]> {
    return Promise.resolve(this.reservations.filter(r => r.buyer_id === buyerId));
  }

  async getFarmerRequests(farmerId: string): Promise<Reservation[]> {
    // In a production app, you'd filter by the listing's farmer_id via a join
    return Promise.resolve(this.reservations); 
  }

  async createReservation(reservation: Reservation): Promise<void> {
    this.reservations.push(reservation);
    
    // Auto-update the listing status when a pledge is made
    await this.listingService.update(reservation.listing_id, { 
      status: 'Reserved' 
    });
  }

  async updateReservationStatus(resId: string, status: 'Confirmed' | 'Cancelled'): Promise<void> {
    const res = this.reservations.find(r => r.res_id === resId);
    if (res) {
      res.pledge_status = status;

      // If cancelled, revert the listing back to 'Available'
      if (status === 'Cancelled') {
        await this.listingService.update(res.listing_id, { status: 'Available' });
      }
    }
  }
}