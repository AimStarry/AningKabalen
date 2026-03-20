import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { trigger, transition, style, animate } from '@angular/animations';
import { FarmerNavbarComponent } from '../shared/components/farmer-navbar/farmer-navbar';
import { ListingService, ApiListing } from '../core/services/listing.service';
import { ToastService } from '../core/services/toast.service';

@Component({
  selector: 'app-my-listing',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, FarmerNavbarComponent],
  templateUrl: './my-listing.html',
  styleUrls: ['./my-listing.css'],
  animations: [
    trigger('fadeUp', [transition(':enter', [style({ opacity: 0, transform: 'translateY(20px)' }), animate('400ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))])]),
    trigger('tableRow', [transition(':enter', [style({ opacity: 0, transform: 'translateX(-10px)' }), animate('280ms ease-out', style({ opacity: 1, transform: 'translateX(0)' }))])])
  ]
})
export class MyListingComponent implements OnInit {
  searchTerm = '';
  listings: ApiListing[] = [];
  loading = true;

  constructor(
    private listingService: ListingService,
    private toast: ToastService,
    private router: Router
  ) {}

  ngOnInit() {
    this.listingService.getMyListings().subscribe({
      next: r => { this.listings = r.listings; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }

  get filtered(): ApiListing[] {
    const t = this.searchTerm.toLowerCase();
    return this.listings.filter(l => l.crop_name.toLowerCase().includes(t));
  }

  getCategoryName(l: ApiListing): string { return (l.category_id as any)?.name ?? ''; }
  getImage(l: ApiListing): string { return l.images?.[0] ?? ''; }

  deleteListing(id: string) {
    const l = this.listings.find(x => x._id === id);
    if (!confirm(`Delete "${l?.crop_name}"? This cannot be undone.`)) return;
    this.listingService.delete(id).subscribe({
      next: () => {
        this.listings = this.listings.filter(l => l._id !== id);
        this.toast.success('Listing Deleted', 'The crop listing has been removed.');
      },
      error: () => this.toast.error('Delete Failed', 'Could not delete listing.')
    });
  }

  getStatusClass(s: string) {
    const m: Record<string,string> = { available:'pill-green', reserved:'pill-amber', sold_out:'pill-red', draft:'pill-gray' };
    return m[s] ?? 'pill-gray';
  }
}
