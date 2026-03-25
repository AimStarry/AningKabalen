import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../shared/components/navbar/navbar';
import { FooterComponent } from '../shared/components/footer/footer';
import { UserService } from '../core/services/user.service';
import { ListingService, ApiListing } from '../core/services/listing.service';
import { ReviewService } from '../core/services/review.service';
import { CartService } from '../core/services/cart.service';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-farmer-profile',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, NavbarComponent, FooterComponent],
  templateUrl: './farmer-profile.html',
  styleUrls: ['./farmer-profile.css'],
  animations: [trigger('fadeUp', [transition(':enter', [style({ opacity: 0, transform: 'translateY(20px)' }), animate('400ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))])])]
})
export class FarmerProfileComponent implements OnInit {
  farmer:   any = null;
  listings: ApiListing[] = [];
  reviews:  any[] = [];
  loading   = true;

  searchTerm   = '';
  selectedCat  = '';
  page = 1; total = 0; limit = 9;
  categories: string[] = [];

  constructor(
    private route:          ActivatedRoute,
    private userService:    UserService,
    private listingService: ListingService,
    private reviewService:  ReviewService,
    private cartService:    CartService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.userService.getById(id).subscribe({ next: r => { this.farmer = r.user; }, error: () => {} });
    this.reviewService.getByTarget(id).subscribe({ next: r => this.reviews = r.reviews, error: () => {} });
    this.listingService.getByFarmer(id).subscribe({
      next: r => {
        this.listings = r.listings;
        this.total = r.listings.length;
        this.categories = [...new Set(r.listings.map(l => (l.category_id as any)?.name ?? '').filter(Boolean))];
        this.loading  = false;
      },
      error: () => { this.loading = false; }
    });
  }

  get filtered(): ApiListing[] {
    return this.listings.filter(l => {
      const catMatch  = !this.selectedCat || (l.category_id as any)?.name === this.selectedCat;
      const nameMatch = l.crop_name.toLowerCase().includes(this.searchTerm.toLowerCase());
      return catMatch && nameMatch;
    });
  }

  getImage(l: ApiListing) { return l.images?.[0] ?? 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=300'; }
  getCatName(l: ApiListing) { return (l.category_id as any)?.name ?? ''; }

  addToCart(listing: ApiListing, event: Event) {
    event.preventDefault(); event.stopPropagation();
    this.cartService.add({ listingId: listing._id, name: listing.crop_name, imageUrl: listing.images?.[0] ?? '', price: listing.price_per_kg, unit: listing.unit, farmName: this.farmer?.farm_details?.farm_name ?? '' });
  }

  prevPage() { if (this.page > 1) this.page--; }
  nextPage() { if (this.page < Math.ceil(this.total / this.limit)) this.page++; }
  get totalPages() { return Math.ceil(this.total / this.limit); }
}
