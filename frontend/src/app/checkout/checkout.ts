import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { trigger, transition, style, animate } from '@angular/animations';
import { NavbarComponent } from '../shared/components/navbar/navbar';
import { FooterComponent } from '../shared/components/footer/footer';
import { CartService } from '../core/services/cart.service';
import { AuthService } from '../core/services/auth.service';
import { OrderService } from '../core/services/order.service';
import { ToastService } from '../core/services/toast.service';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, NavbarComponent, FooterComponent],
  templateUrl: './checkout.html',
  styleUrls: ['./checkout.css'],
  animations: [trigger('fadeUp', [transition(':enter', [style({ opacity: 0, transform: 'translateY(20px)' }), animate('400ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))])])]
})
export class CheckoutComponent implements OnInit {
  cart         = inject(CartService);
  auth         = inject(AuthService);
  orderService = inject(OrderService);
  toast        = inject(ToastService);
  router       = inject(Router);

  name     = '';
  phone    = '';
  address  = '';
  payment  = 'gcash';
  loading  = false;
  submitted= false;
  error    = '';
  ordersPlaced: any[] = [];

  get subtotal() { return this.cart.total(); }
  get fee()      { return Math.round(this.subtotal * 0.02 * 100) / 100; }
  get grand()    { return Math.round((this.subtotal + this.fee) * 100) / 100; }

  ngOnInit() {
    const u = this.auth.currentUser();
    if (u) { this.name = u.name; this.phone = u.phone ?? ''; }
    if (this.cart.items().length === 0) this.router.navigate(['/products']);
  }

  placeOrder() {
    this.error = '';
    if (!this.name.trim())    { this.error = 'Please enter your name.';             return; }
    if (!this.address.trim()) { this.error = 'Please enter your delivery address.'; return; }

    this.loading = true;

    const payload = {
      items: this.cart.items().map(i => ({
        listing_id:  i.listingId,
        quantity_kg: i.qty,
      })),
      payment_method:   this.payment,
      delivery_address: this.address,
      notes: `Name: ${this.name} | Phone: ${this.phone}`,
    };

    this.orderService.create(payload).subscribe({
      next: r => {
        this.loading      = false;
        this.submitted    = true;
        this.ordersPlaced = r.transactions;
        this.cart.clear();
        this.toast.success("Order Placed! 🛒", "Your order has been confirmed. The farmer will prepare it shortly.");
      },
      error: e => {
        this.loading = false;
        this.error   = e?.error?.message ?? 'Failed to place order. Please try again.';
        this.toast.error('Order Failed', this.error);
      }
    });
  }
}
