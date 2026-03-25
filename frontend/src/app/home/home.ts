import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { trigger, transition, style, animate, query, stagger } from '@angular/animations';
import { NavbarComponent } from '../shared/components/navbar/navbar';
import { FooterComponent } from '../shared/components/footer/footer';
import { ToastComponent } from '../shared/components/toast/toast';
import { ListingService, ApiListing } from '../core/services/listing.service';
import { CartService } from '../core/services/cart.service';
import { ToastService } from '../core/services/toast.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, NavbarComponent, FooterComponent, ToastComponent],
  templateUrl: './home.html',
  styleUrls: ['./home.css'],
  animations: [
    trigger('fadeUp', [transition(':enter', [style({ opacity: 0, transform: 'translateY(30px)' }), animate('500ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))])]),
    trigger('staggerCards', [transition(':enter', [query('.product-card', [style({ opacity: 0, transform: 'translateY(20px)' }), stagger(60, animate('400ms ease-out', style({ opacity: 1, transform: 'translateY(0)' })))], { optional: true })])])
  ]
})
export class HomeComponent implements OnInit {
  popularProducts: ApiListing[] = [];
  bestSells:       ApiListing[] = [];
  loading = true;

  // Hardcoded category icon strip — uses Unsplash images, not from API
  categoryLinks = [
    { label: 'Vegetables',    slug: 'vegetables',   imageUrl: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=80&q=80' },
    { label: 'Fruits',        slug: 'fruits',        imageUrl: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=80&q=80' },
    { label: 'Grains',        slug: 'grains',        imageUrl: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=80&q=80' },
    { label: 'Dairy',         slug: 'dairy',         imageUrl: 'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=80&q=80' },
    { label: 'Farm Produce',  slug: 'farm-produce',  imageUrl: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=80&q=80' },
    { label: 'Nuts & Grains', slug: 'nuts-grains',   imageUrl: 'https://images.unsplash.com/photo-1508747703725-719777637510?w=80&q=80' },
  ];

  farmPhotos = [
    'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=300&q=80',
    'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=300&q=80',
    'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=300&q=80',
    'https://images.unsplash.com/photo-1500651230702-0e2d8a49d4e7?w=300&q=80',
  ];

  constructor(
    private listingService: ListingService,
    private cartService:    CartService,
    private toast:          ToastService
  ) {}

  ngOnInit() {
    // Popular products — first 8 available listings
    this.listingService.getAll({ status: 'available', limit: 8 }).subscribe({
      next: r => { this.popularProducts = r.listings; this.loading = false; },
      error: () => { this.loading = false; }
    });
    // Best sells — next 4 listings (offset 8)
    this.listingService.getAll({ status: 'available', limit: 4, page: 2 }).subscribe({
      next: r => this.bestSells = r.listings,
      error: () => {}
    });
  }

  getImage(l: ApiListing): string {
    return l.images?.[0] ?? 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=300';
  }

  getFarmName(l: ApiListing): string {
    return (l.farmer_id as any)?.farm_details?.farm_name ?? (l.farmer_id as any)?.name ?? '';
  }

  getCatName(l: ApiListing): string {
    return (l.category_id as any)?.name ?? '';
  }

  addToCart(listing: ApiListing, event: Event) {
    event.preventDefault();
    event.stopPropagation();
    this.cartService.add({
      listingId: listing._id,
      name:      listing.crop_name,
      imageUrl:  listing.images?.[0] ?? '',
      price:     listing.price_per_kg,
      unit:      listing.unit,
      farmName:  (listing.farmer_id as any)?.farm_details?.farm_name ?? '',
    });
    this.toast.success(`Added to cart!`, `${listing.crop_name} has been added to your cart.`);
  }
}
