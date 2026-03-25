import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { trigger, transition, style, animate } from '@angular/animations';
import { NavbarComponent } from '../shared/components/navbar/navbar';
import { FooterComponent } from '../shared/components/footer/footer';
import { AuthService, User } from '../core/services/auth.service';
import { OrderService } from '../core/services/order.service';
import { ReservationService, ApiReservation } from '../core/services/reservation.service';
import { ToastService } from '../core/services/toast.service';
import { ApiTransaction } from '../core/services/transaction.service';

@Component({
  selector: 'app-buyer-profile',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, NavbarComponent, FooterComponent],
  templateUrl: './buyer-profile.html',
  styleUrls: ['./buyer-profile.css'],
  animations: [trigger('fadeUp', [transition(':enter', [style({ opacity: 0, transform: 'translateY(20px)' }), animate('400ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))])])]
})
export class BuyerProfileComponent implements OnInit {
  user:         User | null       = null;
  orders:       ApiTransaction[]  = [];
  reservations: ApiReservation[]  = [];
  activeTab: 'orders' | 'reservations' = 'orders';
  loading = true;

  constructor(
    public  auth: AuthService,
    private orderService:       OrderService,
    private reservationService: ReservationService,
    private router: Router,
    private toast: ToastService
  ) {}

  ngOnInit() {
    this.user = this.auth.currentUser();
    this.auth.getMe().subscribe({ next: r => this.user = r.user, error: () => {} });

    this.orderService.getMy().subscribe({
      next: r => { this.orders = r.transactions; this.loading = false; },
      error: () => { this.loading = false; }
    });

    this.reservationService.getMy().subscribe({
      next: r => this.reservations = r.reservations,
      error: () => {}
    });
  }

  logout() { this.auth.logout(); }
  viewOrder(id: string) { this.router.navigate(['/order', id]); }

  // Orders (direct purchases)
  getOrderCrop(t: ApiTransaction): string   { return (t.listing_id as any)?.crop_name ?? '—'; }
  getOrderImage(t: ApiTransaction): string  { return (t.listing_id as any)?.images?.[0] ?? ''; }
  getOrderFarmer(t: ApiTransaction): string { return (t.farmer_id as any)?.name ?? '—'; }

  // Reservations (pre-bookings)
  getResCrop(r: ApiReservation): string   { return (r.listing_id as any)?.crop_name ?? '—'; }
  getResImage(r: ApiReservation): string  { return (r.listing_id as any)?.images?.[0] ?? ''; }
  getResFarmer(r: ApiReservation): string { return (r.farmer_id as any)?.name ?? '—'; }

  cancelReservation(r: ApiReservation) {
    if (!confirm('Cancel this reservation?')) return;
    this.reservationService.updateStatus(r._id, 'cancelled').subscribe({
      next: () => { (r as any).status = 'cancelled'; this.toast.info('Reservation Cancelled', 'Your reservation has been cancelled.'); },
      error: () => {}
    });
  }

  cancelOrder(t: ApiTransaction) {
    if (!confirm('Cancel this order?')) return;
    this.orderService.cancel(t._id).subscribe({
      next: () => { (t as any).status = 'cancelled'; this.toast.info('Order Cancelled', 'Your order has been cancelled.'); },
      error: () => {}
    });
  }

  statusClass(s: string): string {
    const m: Record<string,string> = {
      completed:'pill-teal', processed:'pill-green', confirmed:'pill-green',
      pending:'pill-amber', cancelled:'pill-red',
    };
    return m[s] ?? 'pill-gray';
  }

  statusLabel(s: string): string {
    const m: Record<string,string> = {
      pending:'Awaiting Confirmation', confirmed:'Confirmed',
      completed:'Completed', processed:'Processed', cancelled:'Cancelled',
    };
    return m[s] ?? s;
  }
}
