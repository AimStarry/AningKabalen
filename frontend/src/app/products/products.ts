import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { trigger, transition, style, animate } from '@angular/animations';
import { NavbarComponent } from '../shared/components/navbar/navbar';
import { FooterComponent } from '../shared/components/footer/footer';
import { ListingService, ApiListing } from '../core/services/listing.service';
import { CategoryService, ApiCategory } from '../core/services/category.service';
import { UserService } from '../core/services/user.service';
import { CartService } from '../core/services/cart.service';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, NavbarComponent, FooterComponent],
  templateUrl: './products.html',
  styleUrls: ['./products.css'],
  animations: [
    trigger('fadeUp', [transition(':enter', [style({ opacity: 0, transform: 'translateY(20px)' }), animate('400ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))])])
  ]
})
export class ProductsComponent implements OnInit {
  searchTerm       = '';
  selectedCategory = '';   // holds category _id
  selectedFarm     = '';   // holds farmer _id
  loading          = true;

  allListings: ApiListing[] = [];
  categories:  ApiCategory[] = [];
  farms: { _id: string; name: string; farm_name: string }[] = [];

  mosaicCategories = [
    { key: 'vegetables',   label: 'Fruits &\nVege-\ntables', imageUrl: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=500&q=80' },
    { key: 'dairy',        label: 'Cheese,\nDairy,\nMilk',   imageUrl: 'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=300&q=80' },
    { key: 'nuts-grains',  label: 'Nuts &\nBeans',           imageUrl: 'https://images.unsplash.com/photo-1508747703725-719777637510?w=300&q=80' },
    { key: 'grains',       label: 'Grains',                   imageUrl: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=300&q=80' },
    { key: 'farm-produce', label: 'Farm\nProduce',            imageUrl: 'https://images.unsplash.com/photo-1621955964441-c173e01c135b?w=300&q=80' },
  ];

  // Dropdown options derived from loaded categories
  get categoryOptions(): { value: string; label: string }[] {
    return [
      { value: '', label: 'All Categories' },
      ...this.categories.map(c => ({ value: c._id, label: c.name }))
    ];
  }

  constructor(
    private listingService:  ListingService,
    private categoryService: CategoryService,
    private userService:     UserService,
    private cartService:     CartService,
    private route:           ActivatedRoute
  ) {}

  ngOnInit() {
    this.categoryService.getAll().subscribe({
      next: r => {
        this.categories = r.categories;
        // Apply query param after categories are loaded
        const params = this.route.snapshot.queryParams;
        if (params['category']) {
          const cat = this.categories.find(c => c.slug === params['category'] || c._id === params['category']);
          if (cat) this.selectedCategory = cat._id;
        }
        if (params['search']) this.searchTerm = params['search'];
        this.fetchListings();
      },
      error: () => { this.fetchListings(); }
    });

    this.userService.getFarmers().subscribe({
      next: r => this.farms = r.farmers.map(f => ({
        _id: f._id, name: f.name,
        farm_name: f.farm_details?.farm_name ?? f.name
      })),
      error: () => {}
    });
  }

  fetchListings() {
    this.loading = true;
    const params: any = { status: 'available', limit: 100 };
    if (this.selectedCategory) params.category_id = this.selectedCategory;
    if (this.searchTerm)        params.search      = this.searchTerm;
    this.listingService.getAll(params).subscribe({
      next: r => { this.allListings = r.listings; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }

  get visibleCategories(): string[] {
    return [...new Set(this.allListings.map(l => (l.category_id as any)?.name ?? ''))].filter(Boolean);
  }

  getProductsByCategory(catName: string): ApiListing[] {
    return this.allListings.filter(l =>
      (l.category_id as any)?.name === catName &&
      (!this.selectedFarm || (l.farmer_id as any)?._id === this.selectedFarm)
    );
  }

  get isEmpty(): boolean {
    return this.visibleCategories.every(c => this.getProductsByCategory(c).length === 0);
  }

  getImage(l: ApiListing): string {
    return l.images?.[0] ?? 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=300';
  }

  getCatName(l: ApiListing): string {
    return (l.category_id as any)?.name ?? '';
  }

  getFarmName(l: ApiListing): string {
    return (l.farmer_id as any)?.farm_details?.farm_name ?? (l.farmer_id as any)?.name ?? '';
  }

  // Safe DOM id — Angular template can't use regex literals in [id] bindings
  safeId(str: string): string {
    return str.replace(/[^a-zA-Z0-9]/g, '');
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
      farmName:  this.getFarmName(listing),
    });
  }

  scrollRow(catName: string, dir: 'left' | 'right') {
    const el = document.getElementById('row-' + this.safeId(catName));
    if (el) el.scrollBy({ left: dir === 'right' ? 280 : -280, behavior: 'smooth' });
  }

  selectCategory(slug: string) {
    const cat = this.categories.find(c => c.slug === slug);
    this.selectedCategory = cat?._id ?? '';
    this.fetchListings();
    window.scrollTo({ top: 300, behavior: 'smooth' });
  }


  getCountByCategory(catId: string): number {
    return this.allListings.filter(l => (l.category_id as any)?._id === catId).length;
  }

  get totalVisible(): number {
    return this.visibleCategories.reduce((s, c) => s + this.getProductsByCategory(c).length, 0);
  }
  onFilterChange() { this.fetchListings(); }
}
