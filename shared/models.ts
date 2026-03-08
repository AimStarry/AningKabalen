export interface User { 
  uid: string; 
  name: string; 
  role: 'Farmer' | 'Buyer' | 'Admin'; 
  is_verified: boolean; 
  address: string[]; 
  contact_no: string;
}

export interface Farm { 
  farm_id: string; 
  farmer_id: string; 
  farm_name: string; 
  location: string; 
}

export interface Listing { 
  listing_id: string; 
  farmer_id: string; 
  crop_name: string; 
  quantity: number; 
  status: 'Available' | 'Reserved'; 
  culinary_tags: string[]; 
}

export interface Reservation { 
  res_id: string; 
  listing_id: string; 
  buyer_id: string; 
  pledge_status: 'Pending' | 'Confirmed' | 'Cancelled'; 
}

export interface Transaction { 
  transaction_id: string; 
  listing_id: string; 
  buyer_id: string; 
  quantity: number; 
  price: number; 
}

export interface HarvestRecord { 
  harvest_id: string; 
  farm_id: string; 
  crop_name: string; 
  quantity: number; 
}

export interface InventoryLog { 
  log_id: string; 
  listing_id: string; 
  change_type: 'Added' | 'Reserved' | 'Sold'; 
  quantity: number; 
}

const MockData = {
  users: [
    { uid: 'f1', name: 'Mang Juan', role: 'Farmer', is_verified: true },
    { uid: 'b1', name: 'Chef Mario', role: 'Buyer', is_verified: true },
    { uid: 'a1', name: 'Admin User', role: 'Admin', is_verified: true },
  ],
  farms: [
    { farm_id: 'farm1', farmer_id: 'f1', farm_name: 'Juan’s Organic Garden', location: 'San Fernando, Pampanga' }
  ],
  listings: [
    { listing_id: 'l1', farmer_id: 'f1', crop_name: 'Tomatoes', quantity: 100, status: 'Available', culinary_tags: ['Salad-grade'] }
  ],
  reservations: [
    { res_id: 'r1', listing_id: 'l1', buyer_id: 'b1', pledge_status: 'Pending' }
  ],
  transactions: [
    { transaction_id: 't1', listing_id: 'l1', buyer_id: 'b1', quantity: 20, price: 900 }
  ],
  harvests: [
    { harvest_id: 'h1', farm_id: 'farm1', crop_name: 'Tomatoes', quantity: 200 }
  ],
  inventoryLogs: [
    { log_id: 'log1', listing_id: 'l1', change_type: 'Added', quantity: 100 }
  ]
};