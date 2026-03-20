import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { trigger, transition, style, animate } from '@angular/animations';
import { NavbarComponent } from '../shared/components/navbar/navbar';
import { FooterComponent } from '../shared/components/footer/footer';
import { ListingService, ApiListing } from '../core/services/listing.service';
import { UserService } from '../core/services/user.service';
import { ReservationService } from '../core/services/reservation.service';
import { AuthService } from '../core/services/auth.service';
import { ToastService } from '../core/services/toast.service';

interface ReservationDraft {
  listing:  ApiListing;
  qty:      number;
  checked:  boolean;
}

@Component({
  selector: 'app-reservation',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, ReactiveFormsModule, NavbarComponent, FooterComponent],
  templateUrl: './reservation.html',
  styleUrls: ['./reservation.css'],
  animations: [trigger('fadeUp', [transition(':enter', [style({ opacity: 0, transform: 'translateY(24px)' }), animate('450ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))])])]
})
export class ReservationComponent implements OnInit {
  // Search / filter
  searchTerm       = '';
  selectedCategory = '';
  selectedFarm     = '';
  selectedPayment  = 'gcash';

  // State
  loading    = true;
  submitting = false;
  submitted  = false;
  error      = '';

  // Data
  drafts:     ReservationDraft[] = [];
  farmers:    any[] = [];
  categories: any[] = [];
  pickupDate  = '';

  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private listingService:     ListingService,
    private userService:        UserService,
    private reservationService: ReservationService,
    private auth: AuthService,
    private router: Router,
    private toast: ToastService
  ) {
    // Default pickup 3 days from now
    const d = new Date();
    d.setDate(d.getDate() + 3);
    this.pickupDate = d.toISOString().split('T')[0];

    const user = this.auth.currentUser();
    this.form = this.fb.group({
      notes: [''],
      pickup_date: [this.pickupDate, Validators.required],
    });
  }

  ngOnInit() {
    this.userService.getFarmers().subscribe({ next: r => this.farmers = r.farmers, error: () => {} });
    this.loadListings();
  }

  loadListings() {
    this.loading = true;
    const p: any = { status: 'available', limit: 60 };
    if (this.selectedCategory) p.category_id = this.selectedCategory;
    if (this.selectedFarm)     p.farmer_id   = this.selectedFarm;
    if (this.searchTerm)       p.search       = this.searchTerm;

    this.listingService.getAll(p).subscribe({
      next: r => {
        // Build categories from loaded listings
        const cats = [...new Set(r.listings.map(l => (l.category_id as any)?._id).filter(Boolean))];
        this.categories = [...new Set(r.listings.map(l => l.category_id as any).filter(Boolean))]
          .filter((c, i, arr) => arr.findIndex(x => x._id === c._id) === i);
        // Merge with existing drafts to preserve checked state
        const existingMap = new Map(this.drafts.map(d => [d.listing._id, d]));
        this.drafts = r.listings.map(l => existingMap.get(l._id) ?? { listing: l, qty: 1, checked: false });
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
  }

  get filtered(): ReservationDraft[] {
    return this.drafts.filter(d =>
      d.listing.crop_name.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  get checkedItems(): ReservationDraft[] {
    return this.drafts.filter(d => d.checked && d.qty > 0);
  }

  get total(): number {
    return this.checkedItems.reduce((s, d) => s + d.listing.price_per_kg * d.qty, 0);
  }

  getImage(l: ApiListing): string {
    return l.images?.[0] ?? 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=80';
  }

  getFarmerName(l: ApiListing): string {
    return (l.farmer_id as any)?.farm_details?.farm_name ?? (l.farmer_id as any)?.name ?? '';
  }

  getCatName(l: ApiListing): string {
    return (l.category_id as any)?.name ?? '';
  }

  onFilterChange() { this.loadListings(); }

  onSubmit() {
    if (this.checkedItems.length === 0) {
      this.error = 'Please select at least one crop to reserve.';
      return;
    }
    if (!this.form.value.pickup_date) {
      this.error = 'Please select a pickup date.';
      return;
    }

    this.submitting = true;
    this.error      = '';

    const items  = this.checkedItems;
    let   done   = 0;
    let   failed = false;

    items.forEach(item => {
      this.reservationService.create({
        listing_id:      item.listing._id,
        quantity_kg:     item.qty,
        payment_method:  this.selectedPayment as any,
        pickup_schedule: new Date(this.form.value.pickup_date).toISOString(),
        notes:           this.form.value.notes,
      }).subscribe({
        next: () => {
          done++;
          if (done === items.length && !failed) {
            this.submitting = false;
            this.submitted  = true;
            this.toast.success("Reservation Submitted! 📋", "Waiting for farmer confirmation within 48 hours.");
          }
        },
        error: e => {
          if (!failed) {
            failed          = true;
            this.submitting = false;
            this.error      = e?.error?.message ?? 'Failed to submit reservation.';
            this.toast.error('Reservation Failed', this.error);
          }
        }
      });
    });
  }
}
