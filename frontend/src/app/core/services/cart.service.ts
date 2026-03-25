import { Injectable, signal, computed } from '@angular/core';

export interface CartItem {
  listingId: string;
  name: string;
  imageUrl: string;
  price: number;
  unit: string;
  farmName: string;
  qty: number;
}

@Injectable({ providedIn: 'root' })
export class CartService {
  private CART_KEY = 'ak_cart';
  items = signal<CartItem[]>(this.load());

  /** When set, checkout will only process items from this farm. null = all items. */
  checkoutFarm = signal<string | null>(null);

  /** Items scoped to the current checkout (all or single farm) */
  checkoutItems = computed(() => {
    const farm = this.checkoutFarm();
    return farm ? this.items().filter(i => i.farmName === farm) : this.items();
  });

  count   = computed(() => this.items().reduce((s, i) => s + i.qty, 0));
  total   = computed(() => this.items().reduce((s, i) => s + i.price * i.qty, 0));

  /** Total for only the items going to checkout */
  checkoutTotal = computed(() =>
    this.checkoutItems().reduce((s, i) => s + i.price * i.qty, 0)
  );

  add(item: Omit<CartItem, 'qty'>, qty = 1) {
    this.items.update(cart => {
      const existing = cart.find(c => c.listingId === item.listingId);
      if (existing) return cart.map(c => c.listingId === item.listingId ? { ...c, qty: c.qty + qty } : c);
      return [...cart, { ...item, qty }];
    });
    this.save();
  }

  remove(listingId: string) {
    this.items.update(c => c.filter(i => i.listingId !== listingId));
    this.save();
  }

  updateQty(listingId: string, qty: number) {
    if (qty <= 0) { this.remove(listingId); return; }
    this.items.update(c => c.map(i => i.listingId === listingId ? { ...i, qty } : i));
    this.save();
  }

  clear() { this.items.set([]); this.save(); }

  private save() { localStorage.setItem(this.CART_KEY, JSON.stringify(this.items())); }
  private load(): CartItem[] {
    try { return JSON.parse(localStorage.getItem(this.CART_KEY) ?? '[]'); }
    catch { return []; }
  }
}
