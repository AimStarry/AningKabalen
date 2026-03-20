import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { trigger, transition, style, animate } from '@angular/animations';
import { FarmerNavbarComponent } from '../shared/components/farmer-navbar/farmer-navbar';
import { CategoryService, ApiCategory } from '../core/services/category.service';
import { ListingService, ApiListing } from '../core/services/listing.service';
import { ToastService } from '../core/services/toast.service';

@Component({
  selector: 'app-create-listing',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, FarmerNavbarComponent],
  templateUrl: './create-listing.html',
  styleUrls: ['./create-listing.css'],
  animations: [
    trigger('fadeInUp', [transition(':enter', [style({ opacity: 0, transform: 'translateY(20px)' }), animate('400ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))])]),
    trigger('slideInRight', [
      transition(':enter', [style({ opacity: 0, transform: 'translateX(100%)' }), animate('350ms cubic-bezier(0.4,0,0.2,1)', style({ opacity: 1, transform: 'translateX(0)' }))]),
      transition(':leave', [animate('300ms cubic-bezier(0.4,0,0.2,1)', style({ opacity: 0, transform: 'translateX(100%)' }))])
    ]),
    trigger('tableRow',    [transition(':enter', [style({ opacity: 0, transform: 'translateX(-8px)' }), animate('280ms ease-out', style({ opacity: 1, transform: 'translateX(0)' }))])]),
    trigger('overlayFade', [
      transition(':enter', [style({ opacity: 0 }), animate('200ms', style({ opacity: 1 }))]),
      transition(':leave', [animate('200ms', style({ opacity: 0 }))])
    ])
  ]
})
export class CreateListingComponent implements OnInit {
  modalOpen  = false;
  editingId: string | null = null;
  searchTerm = '';
  dragOver   = false;
  previewUrl: string | null = null;
  selectedFile: File | null = null;
  loading    = false;
  listLoading = true;

  categories: ApiCategory[] = [];
  listings:   ApiListing[]  = [];

  listingForm!: FormGroup;

  constructor(
    private fb:              FormBuilder,
    private categoryService: CategoryService,
    private listingService:  ListingService,
    private toast:           ToastService
  ) {}

  ngOnInit() {
    this.listingForm = this.fb.group({
      categoryId:  ['', Validators.required],
      cropName:    ['', [Validators.required, Validators.minLength(2)]],
      variety:     [''],
      quantity:    [null, [Validators.required, Validators.min(1)]],
      quantityKg:  [null, [Validators.required, Validators.min(0.1)]],
      availableKg: [null, [Validators.required, Validators.min(0)]],
      price:       [null, [Validators.required, Validators.min(0.01)]],
      unit:        ['kg', Validators.required],
      status:      ['available', Validators.required],
      description: ['', [Validators.required, Validators.minLength(10)]],
      tags:        [''],
    });

    this.categoryService.getAll().subscribe({ next: r => this.categories = r.categories, error: () => {} });
    this.loadListings();
  }

  loadListings() {
    this.listLoading = true;
    this.listingService.getMyListings().subscribe({
      next: r => { this.listings = r.listings; this.listLoading = false; },
      error: () => { this.listLoading = false; }
    });
  }

  get filteredListings(): ApiListing[] {
    if (!this.searchTerm.trim()) return this.listings;
    return this.listings.filter(l =>
      l.crop_name.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  getCategoryName(l: ApiListing): string { return (l.category_id as any)?.name ?? ''; }
  getImage(l: ApiListing): string { return l.images?.[0] ?? ''; }

  openModal(listing?: ApiListing) {
    this.editingId = listing?._id ?? null;
    if (listing) {
      this.listingForm.patchValue({
        categoryId:  (listing.category_id as any)?._id ?? listing.category_id,
        cropName:    listing.crop_name,
        variety:     listing.variety ?? '',
        quantity:    listing.quantity,
        quantityKg:  listing.quantity_kg,
        availableKg: listing.available_kg,
        price:       listing.price_per_kg,
        unit:        listing.unit,
        status:      listing.status,
        description: listing.description,
        tags:        listing.tags?.join(', ') ?? '',
      });
      this.previewUrl = listing.images?.[0] ?? null;
    } else {
      this.listingForm.reset({ status: 'available', unit: 'kg' });
      this.previewUrl = null;
      this.selectedFile = null;
    }
    this.modalOpen = true;
  }

  closeModal() {
    this.modalOpen    = false;
    this.editingId    = null;
    this.previewUrl   = null;
    this.selectedFile = null;
  }

  onSubmit() {
    if (this.listingForm.invalid) { this.listingForm.markAllAsTouched(); return; }
    this.loading = true;

    const v  = this.listingForm.value;
    const fd = new FormData();
    fd.append('category_id',  v.categoryId);
    fd.append('crop_name',    v.cropName);
    if (v.variety)     fd.append('variety',     v.variety);
    fd.append('quantity',     v.quantity);
    fd.append('quantity_kg',  v.quantityKg);
    fd.append('available_kg', v.availableKg);
    fd.append('price_per_kg', v.price);
    fd.append('unit',         v.unit);
    fd.append('status',       v.status);
    fd.append('description',  v.description);
    if (v.tags) {
      const tagsArr = v.tags.split(',').map((t: string) => t.trim()).filter(Boolean);
      tagsArr.forEach((tag: string) => fd.append('tags[]', tag));
    }
    if (this.selectedFile) fd.append('images', this.selectedFile);

    const isEdit = !!this.editingId;
    const req$ = isEdit
      ? this.listingService.update(this.editingId!, fd)
      : this.listingService.create(fd);

    req$.subscribe({
      next: r => {
        if (isEdit) {
          this.listings = this.listings.map(l => l._id === this.editingId ? r.listing : l);
          this.toast.success('Listing Updated', `${r.listing.crop_name} has been updated successfully.`);
        } else {
          this.listings = [r.listing, ...this.listings];
          this.toast.success('Listing Created! 🌾', `${r.listing.crop_name} is now live on the marketplace.`);
        }
        this.loading = false;
        this.closeModal();
      },
      error: e => {
        this.loading = false;
        this.toast.error('Save Failed', e?.error?.message ?? 'Could not save listing. Please try again.');
      }
    });
  }

  deleteListing(id: string, name: string) {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    this.listingService.delete(id).subscribe({
      next: () => {
        this.listings = this.listings.filter(l => l._id !== id);
        this.toast.success('Listing Deleted', `"${name}" has been removed.`);
      },
      error: () => this.toast.error('Delete Failed', 'Could not delete listing.')
    });
  }

  // Image upload
  onDragOver(e: DragEvent)  { e.preventDefault(); this.dragOver = true; }
  onDragLeave()              { this.dragOver = false; }
  onDrop(e: DragEvent)       { e.preventDefault(); this.dragOver = false; const f = e.dataTransfer?.files[0]; if (f) this.previewFile(f); }
  onFileChange(e: Event)     { const f = (e.target as HTMLInputElement).files?.[0]; if (f) this.previewFile(f); }
  previewFile(file: File)    {
    if (!file.type.startsWith('image/')) { this.toast.error('Invalid File', 'Please upload an image file.'); return; }
    this.selectedFile = file;
    const r = new FileReader();
    r.onload = ev => this.previewUrl = ev.target?.result as string;
    r.readAsDataURL(file);
  }

  statusClass(s: string) {
    const m: Record<string,string> = { available:'pill-green', reserved:'pill-amber', sold_out:'pill-red', draft:'pill-gray' };
    return m[s] ?? 'pill-gray';
  }
  hasError(field: string): boolean {
    const c = this.listingForm.get(field);
    return !!(c?.invalid && c.touched);
  }
}
