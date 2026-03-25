import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { NavbarComponent } from '../shared/components/navbar/navbar';
import { FooterComponent } from '../shared/components/footer/footer';
import { ListingService, ApiListing } from '../core/services/listing.service';
import { ReviewService } from '../core/services/review.service';
import { CartService } from '../core/services/cart.service';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-crop-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, NavbarComponent, FooterComponent],
  templateUrl: './crop-detail.html',
  styleUrls: ['./crop-detail.css'],
  animations: [trigger('fadeUp', [transition(':enter', [style({ opacity: 0, transform: 'translateY(20px)' }), animate('400ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))])])]
})
export class CropDetailComponent implements OnInit {
  listing: ApiListing | null = null;
  reviews: any[]  = [];
  loading  = true;
  quantity = 1;
  activeImg = 0;
  addedMsg  = false;

  constructor(
    private route:          ActivatedRoute,
    private listingService: ListingService,
    private reviewService:  ReviewService,
    private cartService:    CartService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.listingService.getById(id).subscribe({
      next: r => {
        this.listing = r.listing;
        this.loading  = false;
        this.reviewService.getByTarget(id).subscribe({
          next: rv => this.reviews = rv.reviews, error: () => {}
        });
      },
      error: () => { this.loading = false; }
    });
  }

  getFarmerName()  { return (this.listing?.farmer_id as any)?.name ?? '—'; }
  getFarmName()    { return (this.listing?.farmer_id as any)?.farm_details?.farm_name ?? '—'; }
  getFarmerId()    { return (this.listing?.farmer_id as any)?._id ?? ''; }
  getFarmerRating(){ return (this.listing?.farmer_id as any)?.rating?.average ?? 0; }
  getImage(i = 0)  { return this.listing?.images?.[i] ?? 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600'; }
  getCatName()     { return (this.listing?.category_id as any)?.name ?? ''; }

  inc() { if (this.listing && this.quantity < this.listing.available_kg) this.quantity++; }
  dec() { if (this.quantity > 1) this.quantity--; }

  addToCart() {
    if (!this.listing) return;
    this.cartService.add({
      listingId: this.listing._id,
      name:      this.listing.crop_name,
      imageUrl:  this.listing.images?.[0] ?? '',
      price:     this.listing.price_per_kg,
      unit:      this.listing.unit,
      farmName:  this.getFarmName(),
    }, this.quantity);
    this.addedMsg = true;
    setTimeout(() => this.addedMsg = false, 2000);
  }
}
