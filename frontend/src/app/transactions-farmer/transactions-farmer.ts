import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { trigger, transition, style, animate } from '@angular/animations';
import { FarmerNavbarComponent } from '../shared/components/farmer-navbar/farmer-navbar';
import { TransactionService, ApiTransaction } from '../core/services/transaction.service';
import { ReservationService, ApiReservation } from '../core/services/reservation.service';
import { ToastService } from '../core/services/toast.service';

@Component({
  selector: 'app-transactions-farmer',
  standalone: true,
  imports: [CommonModule, FormsModule, FarmerNavbarComponent],
  templateUrl: './transactions-farmer.html',
  styleUrls: ['./transactions-farmer.css'],
  animations: [
    trigger('fadeUp', [transition(':enter', [style({ opacity: 0, transform: 'translateY(20px)' }), animate('400ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))])]),
    trigger('expandRow', [
      transition(':enter', [style({ opacity: 0, height: 0 }), animate('300ms ease-out', style({ opacity: 1, height: '*' }))]),
      transition(':leave', [animate('250ms ease-in', style({ opacity: 0, height: 0 }))])
    ])
  ]
})
export class TransactionsFarmerComponent implements OnInit {
  activeTab: 'reservations' | 'orders' = 'reservations';
  searchTerm = '';

  reservations: (ApiReservation & { expanded: boolean })[] = [];
  orders:       (ApiTransaction & { expanded: boolean })[] = [];
  loading = true;

  constructor(
    private transactionService:  TransactionService,
    private reservationService: ReservationService,
    private toast: ToastService
  ) {}

  ngOnInit() {
    this.reservationService.getMy().subscribe({
      next: r => { this.reservations = r.reservations.map(x => ({ ...x, expanded: false })); this.loading = false; },
      error: () => { this.loading = false; }
    });
    this.transactionService.getMy().subscribe({
      next: r => this.orders = r.transactions
        .filter(t => t.type === 'order')
        .map(t => ({ ...t, expanded: false })),
      error: () => {}
    });
  }

  get filteredReservations() {
    return this.reservations.filter(r =>
      this.getBuyerName(r).toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      this.getCropName(r).toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  get filteredOrders() {
    return this.orders.filter(o =>
      this.getOrderBuyer(o).toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      this.getOrderCrop(o).toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  get pendingReservations() { return this.reservations.filter(r => r.status === 'pending').length; }
  get pendingOrders()       { return this.orders.filter(o => o.status === 'confirmed').length; }

  // Reservation helpers
  getBuyerName(r: ApiReservation): string { return (r.buyer_id as any)?.name ?? '—'; }
  getCropName(r: ApiReservation): string  { return (r.listing_id as any)?.crop_name ?? '—'; }
  getCropImage(r: ApiReservation): string { return (r.listing_id as any)?.images?.[0] ?? ''; }

  // Order helpers
  getOrderBuyer(t: ApiTransaction): string { return (t.buyer_id as any)?.name ?? '—'; }
  getOrderCrop(t: ApiTransaction): string  { return (t.listing_id as any)?.crop_name ?? '—'; }
  getOrderImage(t: ApiTransaction): string { return (t.listing_id as any)?.images?.[0] ?? ''; }

  confirmReservation(r: ApiReservation & { expanded: boolean }) {
    this.reservationService.updateStatus(r._id, 'confirmed').subscribe({
      next: () => { (r as any).status = 'confirmed'; r.expanded = false; this.toast.success('Reservation Confirmed ✓', 'The buyer has been notified.'); },
      error: () => {}
    });
  }

  cancelReservation(r: ApiReservation & { expanded: boolean }) {
    if (!confirm('Cancel this reservation?')) return;
    this.reservationService.updateStatus(r._id, 'cancelled').subscribe({
      next: () => { (r as any).status = 'cancelled'; r.expanded = false; this.toast.info('Reservation Declined', 'The reservation has been cancelled.'); },
      error: () => {}
    });
  }

  markOrderComplete(t: ApiTransaction) {
    this.transactionService.updateStatus(t._id, 'completed').subscribe({
      next: () => { (t as any).status = 'completed'; this.toast.success('Order Completed! 🎉', 'Great job! The buyer has been notified.'); },
      error: () => {}
    });
  }

  toggle(row: any) { row.expanded = !row.expanded; }

  statusClass(s: string) {
    const m: Record<string,string> = {
      pending:'pill-amber', confirmed:'pill-green', cancelled:'pill-red',
      completed:'pill-teal', processed:'pill-green',
    };
    return m[s] ?? 'pill-gray';
  }
}