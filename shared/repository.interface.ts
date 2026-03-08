import { Listing, User, Reservation } from './models';

export interface IListingRepository {
  // Core CRUD
  findAll(): Promise<Listing[]>;
  findById(id: string): Promise<Listing | null>;
  create(listing: Listing): Promise<void>;
  update(id: string, listing: Partial<Listing>): Promise<void>;
  delete(id: string): Promise<void>;

  // Filtering for the Marketplace (Culinary-Centric)
  findByTag(tag: string): Promise<Listing[]>;
  
  // Managing the Farmer's Inventory
  findByFarmer(farmerUid: string): Promise<Listing[]>;
  
  // Handling the Handshake (Reservations)
  reserveListing(listingId: string, reservation: Reservation): Promise<boolean>;
}
