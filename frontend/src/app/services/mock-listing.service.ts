// client/src/app/services/mock-listing.service.ts
import { Injectable } from '@angular/core';
import { Listing, Reservation } from '@shared/models';
import { IListingRepository } from '@shared/repository.interface';

@Injectable({ providedIn: 'root' })
export class MockListingService implements IListingRepository {
  
  // Now strictly typed to your Listing model
  private mockListings: Listing[] = [
    {
      listing_id: 'l1',
      farmer_id: 'f1',
      crop_name: 'Organic Tomatoes',
      quantity: 50,
      status: 'Available',
      culinary_tags: ['Salad-grade', 'Fresh']
    }
  ];

  async findAll(): Promise<Listing[]> {
    return Promise.resolve(this.mockListings);
  }

  async findById(id: string): Promise<Listing | null> {
    return Promise.resolve(this.mockListings.find(l => l.listing_id === id) || null);
  }

  async create(listing: Listing): Promise<void> {
    this.mockListings.push(listing);
    return Promise.resolve();
  }

  async update(id: string, listing: Partial<Listing>): Promise<void> {
    const index = this.mockListings.findIndex(l => l.listing_id === id);
    if (index !== -1) {
      // Merge updates while maintaining the structure
      this.mockListings[index] = { ...this.mockListings[index], ...listing } as Listing;
    }
    return Promise.resolve();
  }

  async delete(id: string): Promise<void> {
    this.mockListings = this.mockListings.filter(l => l.listing_id !== id);
    return Promise.resolve();
  }

  async findByTag(tag: string): Promise<Listing[]> {
    return Promise.resolve(this.mockListings.filter(l => l.culinary_tags.includes(tag)));
  }

  async findByFarmer(farmerUid: string): Promise<Listing[]> {
    return Promise.resolve(this.mockListings.filter(l => l.farmer_id === farmerUid));
  }

  async reserveListing(listingId: string, reservation: Reservation): Promise<boolean> {
    console.log('Digital Handshake initiated for:', listingId);
    // This logic is now handled by the MockReservationService
    return Promise.resolve(true);
  }
}