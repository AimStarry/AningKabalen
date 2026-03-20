import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { trigger, transition, style, animate } from '@angular/animations';
import { NavbarComponent } from '../shared/components/navbar/navbar';
import { FooterComponent } from '../shared/components/footer/footer';
import { CartService, CartItem } from '../core/services/cart.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterLink, NavbarComponent, FooterComponent],
  templateUrl: './cart.html',
  styleUrls: ['./cart.css'],
  animations: [
    trigger('fadeUp', [transition(':enter', [style({ opacity: 0, transform: 'translateY(20px)' }), animate('400ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))])])
  ]
})
export class CartComponent {
  cart = inject(CartService);

  updateQty(item: CartItem, qty: number) { this.cart.updateQty(item.listingId, qty); }
  remove(item: CartItem)                 { this.cart.remove(item.listingId); }
  clearCart()                            { this.cart.clear(); }
}
