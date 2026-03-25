import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { NavbarComponent } from '../shared/components/navbar/navbar';
import { FooterComponent } from '../shared/components/footer/footer';
import { CartService, CartItem } from '../core/services/cart.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterLink, NavbarComponent, FooterComponent],
  templateUrl: './cart.html',
  styleUrl: './cart.css'
})
export class CartComponent {
  cart   = inject(CartService);
  router = inject(Router);

  updateQty(item: CartItem, qty: number) { this.cart.updateQty(item.listingId, qty); }
  remove(item: CartItem)                 { this.cart.remove(item.listingId); }
  clearCart()                            { this.cart.clear(); }

  groupedItems(): { farmName: string; items: CartItem[] }[] {
    const map = new Map<string, CartItem[]>();
    for (const item of this.cart.items()) {
      const key = item.farmName ?? 'Unknown Farm';
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(item);
    }
    return Array.from(map.entries()).map(([farmName, items]) => ({ farmName, items }));
  }

  farmSubtotal(group: { items: CartItem[] }): number {
    return group.items.reduce((sum, i) => sum + i.price * i.qty, 0);
  }

  clearFarm(farmName: string): void {
    this.cart.items()
      .filter(i => i.farmName === farmName)
      .forEach(i => this.cart.remove(i.listingId));
  }

  /** Checkout only items from a specific farm */
  checkoutFarm(farmName: string): void {
    this.cart.checkoutFarm.set(farmName);
    this.router.navigate(['/checkout']);
  }

  /** Checkout all items (clear any farm filter) */
  checkoutAll(): void {
    this.cart.checkoutFarm.set(null);
    this.router.navigate(['/checkout']);
  }
}
