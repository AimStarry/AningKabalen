import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../shared/components/navbar/navbar';
import { FooterComponent } from '../shared/components/footer/footer';
import { ToastComponent } from '../shared/components/toast/toast';
import { ListingService, ApiListing } from '../core/services/listing.service';
import { CategoryService, ApiCategory } from '../core/services/category.service';
import { UserService } from '../core/services/user.service';
import { CartService } from '../core/services/cart.service';
import { ToastService } from '../core/services/toast.service';
import { trigger, transition, style, animate, stagger, query } from '@angular/animations';

@Component({
  selector: 'app-view-all',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, NavbarComponent, FooterComponent, ToastComponent],
  templateUrl: './view-all.html',
  styleUrls: ['./view-all.css'],
  animations: [
    trigger('fadeUp', [transition(':enter', [style({ opacity: 0, transform: 'translateY(20px)' }), animate('400ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))])]),
    trigger('stagger',  [transition('* => *', [query(':enter', [style({ opacity: 0, transform: 'translateY(16px)' }), stagger(40, animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' })))], { optional: true })])])
  ]
})
export class ViewAllComponent implements OnInit {
  listings:         ApiListing[]  = [];
  categories:       ApiCategory[] = [];
  farms: { _id: string; farm_name: string }[] = [];

  title            = 'All Products';
  searchTerm       = '';
  selectedCategory = '';   // _id
  selectedFarm     = '';   // _id
  loading          = true;
  page = 1; total = 0; limit = 12;

  constructor(
    private listingService:  ListingService,
    private categoryService: CategoryService,
    private userService:     UserService,
    private cartService:     CartService,
    private route:           ActivatedRoute,
    private toast:           ToastService
  ) {}

  ngOnInit() {
    this.categoryService.getAll().subscribe({ next: r => this.categories = r.categories, error: () => {} });
    this.userService.getFarmers().subscribe({
      next: r => this.farms = r.farmers.map(f => ({ _id: f._id, farm_name: f.farm_details?.farm_name ?? f.name })),
      error: () => {}
    });
    this.route.queryParams.subscribe(p => {
      if (p['category']) {
        this.title = p['category'];
        const cat  = this.categories.find(c => c.name === p['category'] || c.slug === p['category']);
        if (cat) this.selectedCategory = cat._id;
      }
      if (p['search']) { this.searchTerm = p['search']; this.title = `Results for "${p['search']}"`; }
      this.load();
    });
  }

  load() {
    this.loading = true;
    const params: any = { status: 'available', page: this.page, limit: this.limit };
    if (this.selectedCategory) params.category_id = this.selectedCategory;
    if (this.selectedFarm)     params.farmer_id   = this.selectedFarm;
    if (this.searchTerm)       params.search      = this.searchTerm;
    this.listingService.getAll(params).subscribe({
      next: r => { this.listings = r.listings; this.total = r.total; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }

  get filtered(): ApiListing[] { return this.listings; }

  get totalPages() { return Math.ceil(this.total / this.limit); }
  nextPage()  { if (this.page < this.totalPages) { this.page++; this.load(); } }
  prevPage()  { if (this.page > 1) { this.page--; this.load(); } }

  getImage(l: ApiListing) { return l.images?.[0] ?? 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=300'; }
  getCatName(l: ApiListing) { return (l.category_id as any)?.name ?? ''; }

  addToCart(l: ApiListing, e: Event) {
    e.preventDefault(); e.stopPropagation();
    this.cartService.add({ listingId: l._id, name: l.crop_name, imageUrl: l.images?.[0] ?? '', price: l.price_per_kg, unit: l.unit, farmName: (l.farmer_id as any)?.farm_details?.farm_name ?? '' });
    this.toast.success(`Added to cart!`, `${l.crop_name} has been added to your cart.`);
  }

  onFilterChange() { this.page = 1; this.load(); }
}
