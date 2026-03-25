// ── Shared types used across all components ──────────────────

export type ListingStatus = 'available' | 'reserved' | 'sold_out' | 'draft';
export type OrderType     = 'reservation' | 'order';
export type OrderStatus   = 'confirmed' | 'pending' | 'cancelled' | 'completed' | 'processed';
export type VerifStatus   = 'pending' | 'verified' | 'flagged' | 'rejected';

export interface Listing {
  id: string;
  categoryId: string;
  category: string;
  cropName: string;
  variety?: string;
  quantity: number;
  quantityKg: number;
  availableKg: number;
  price: number;
  description: string;
  status: ListingStatus;
  imageUrl?: string;
  tags?: string[];
}

export interface OrderRow {
  id: string;
  type: OrderType;
  buyerName: string;
  crop: string;
  quantity: number;
  unitPrice: number;
  total: number;
  expiration: string;
  schedule: string;
  status: OrderStatus;
}

export interface VerificationUser {
  id: string;
  name: string;
  farmName: string;
  location: string;
  status: VerifStatus;
  submittedAt: string;
}

export interface AdminListing {
  farmer: string;
  crop: string;
  quantity: number;
  tags: string[];
  status: ListingStatus;
}

export interface AdminTransaction {
  farmer: string;
  crop: string;
  quantity: number;
  buyer: string;
  status: 'processed' | 'pending' | 'cancelled';
}

export interface CreateListingForm {
  categoryId: string;
  imageFile: File | null;
  cropName: string;
  quantity: number | null;
  quantityKg: number | null;
  availableKg: number | null;
  price: number | null;
  status: ListingStatus;
  description: string;
}
