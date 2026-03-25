import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { trigger, transition, style, animate, query, stagger } from '@angular/animations';
import { FarmerNavbarComponent } from '../shared/components/farmer-navbar/farmer-navbar';
import { ListingService, ApiListing } from '../core/services/listing.service';
import { TransactionService, ApiTransaction } from '../core/services/transaction.service';
import { ReservationService, ApiReservation } from '../core/services/reservation.service';
import { AuthService } from '../core/services/auth.service';

@Component({
  selector: 'app-farmer-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, FarmerNavbarComponent],
  templateUrl: './farmer-dashboard.html',
  styleUrls: ['./farmer-dashboard.css'],
  animations: [
    trigger('fadeInUp',    [transition(':enter', [style({ opacity: 0, transform: 'translateY(20px)' }), animate('400ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))])]),
    trigger('staggerCards',[transition(':enter', [query('.stat-card', [style({ opacity: 0, transform: 'translateY(24px)' }), stagger(80, animate('400ms ease-out', style({ opacity: 1, transform: 'translateY(0)' })))], { optional: true })])]),
    trigger('tableRow',    [transition(':enter', [style({ opacity: 0, transform: 'translateX(-12px)' }), animate('300ms ease-out', style({ opacity: 1, transform: 'translateX(0)' }))])])
  ]
})
export class FarmerDashboardComponent implements OnInit {
  today = new Date().toLocaleDateString("en-PH",{weekday:"long",year:"numeric",month:"long",day:"numeric"});
  crops:        ApiListing[]     = [];
  transactions: ApiTransaction[] = [];
  loading = true;

  stats = { totalEarning: 0, pendingReservations: 0, pendingOrders: 0 };

  constructor(
    private listingService:     ListingService,
    private transactionService: TransactionService,
    private reservationService:  ReservationService,
    public  auth: AuthService
  ) {}

  ngOnInit() {
  this.listingService.getMyListings().subscribe({
    next: r => this.crops = r.listings,
    error: () => {}
  });

  // ✅ Load reservations for pending count
  this.reservationService.getMy().subscribe({
    next: r => {
      this.stats.pendingReservations = r.reservations.filter(r => r.status === 'pending').length;
    },
    error: () => {}
  });

  this.transactionService.getMy().subscribe({
    next: r => {
      this.transactions = r.transactions;

      // ✅ Earnings from completed transactions
      this.stats.totalEarning = r.transactions
        .filter(t => t.status === 'completed' || t.status === 'processed')
        .reduce((s, t) => s + t.total_amount, 0);

      // ✅ Active orders = confirmed direct orders (not reservations)
      this.stats.pendingOrders = r.transactions
        .filter(t => t.type === 'order' && t.status === 'confirmed')
        .length;

      this.loading = false;
    },
    error: () => { this.loading = false; }
  });
}

  getCategoryName(l: ApiListing): string { return (l.category_id as any)?.name ?? ''; }
  getBuyerName(t: ApiTransaction): string { return (t.buyer_id as any)?.name ?? 'Unknown'; }
  getCropName(t: ApiTransaction): string  { return (t.listing_id as any)?.crop_name ?? ''; }

  getStatusClass(status: string): string {
    const m: Record<string, string> = {
      available: 'pill-green', reserved: 'pill-amber', sold_out: 'pill-red', draft: 'pill-gray',
      confirmed: 'pill-green', pending: 'pill-amber',  cancelled: 'pill-red',
      completed: 'pill-teal',  processed: 'pill-green',
    };
    return m[status] ?? 'pill-gray';
  }

  formatCurrency(val: number): string {
    return `₱${val.toLocaleString('en-PH', { minimumFractionDigits: 2 })}`;
  }
}
