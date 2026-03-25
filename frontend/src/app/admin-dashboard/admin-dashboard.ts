import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { trigger, transition, style, animate, query, stagger } from '@angular/animations';
import { SidebarComponent } from '../shared/components/sidebar';
import { UserService } from '../core/services/user.service';
import { ListingService, ApiListing } from '../core/services/listing.service';
import { TransactionService, ApiTransaction } from '../core/services/transaction.service';
import { AuthService } from '../core/services/auth.service';
import { ContactService, ContactMessage } from '../core/services/contact.service';

interface EditableUser {
  id: string;
  name: string;
  farmName: string;
  location: string;
  submittedAt: string;
  status: string;
  editing: boolean;
  pendingStatus: string;
}

interface EditableListing extends ApiListing {
  editing: boolean;
  pendingStatus: string;
  farmerName: string;
  cropName: string;
}

interface EditableTxn extends ApiTransaction {
  editing: boolean;
  pendingStatus: string;
  farmerName: string;
  cropName:   string;
  buyerName:  string;
  qtyKg:      number;
}

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, SidebarComponent],
  templateUrl: './admin-dashboard.html',
  styleUrls: ['./admin-dashboard.css'],
  animations: [
    trigger('fadeInUp',    [transition(':enter', [style({ opacity: 0, transform: 'translateY(24px)' }), animate('420ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))])]),
    trigger('staggerCards',[transition(':enter', [query('.stat-card', [style({ opacity: 0, transform: 'translateY(24px)' }), stagger(80, animate('400ms ease-out', style({ opacity: 1, transform: 'translateY(0)' })))], { optional: true })])]),
    trigger('tableRow',    [transition(':enter', [style({ opacity: 0, transform: 'translateX(-10px)' }), animate('280ms ease-out', style({ opacity: 1, transform: 'translateX(0)' }))])])
  ]
})
export class AdminDashboardComponent implements OnInit {
  sidebarOpen = false;
  today = new Date().toLocaleDateString('en-PH', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  stats = { registeredUsers: 0, currentListings: 0, totalListings: 0, totalTransactions: 0, kilosReserved: 0, reservationsPending: 0, unreadMessages: 0 };

  verifications: EditableUser[]    = [];
  listings:      EditableListing[] = [];
  transactions:  EditableTxn[]     = [];
  contactMessages: ContactMessage[] = [];

  verificationStatuses = ['pending', 'verified', 'flagged', 'rejected'];
  listingStatuses      = ['available', 'reserved', 'sold_out', 'draft'];
  transactionStatuses  = ['pending', 'confirmed', 'processed', 'completed', 'cancelled'];

  constructor(
    private userService:        UserService,
    private listingService:     ListingService,
    private transactionService: TransactionService,
    private contactService:     ContactService,
    public  auth: AuthService
  ) {}

  ngOnInit() {
    this.userService.getAll({ limit: 20 }).subscribe({
      next: r => {
        this.verifications = r.users
          .filter(u => u.role === 'farmer')
          .map(u => ({
            id:          u._id,
            name:        u.name,
            farmName:    u.farm_details?.farm_name ?? '—',
            location:    '—',
            submittedAt: (u as any).created_at?.slice(0, 10) ?? '—',
            status:      u.verification_status,
            editing:     false,
            pendingStatus: u.verification_status,
          }));
        this.stats.registeredUsers = r.total;
      },
      error: () => {}
    });

    this.listingService.getAll({ limit: 20 }).subscribe({
      next: r => {
        this.listings = r.listings.map(l => ({
          ...l,
          farmerName:    (l.farmer_id as any)?.name ?? '—',
          cropName:      l.crop_name,
          editing:       false,
          pendingStatus: l.status,
        }));
        this.stats.currentListings = r.listings.filter(l => l.status === 'available').length;
        this.stats.totalListings   = r.total;
      },
      error: () => {}
    });

    this.transactionService.getAll().subscribe({
      next: r => {
        this.transactions = r.transactions.map(t => ({
          ...t,
          farmerName:    (t.farmer_id as any)?.name ?? '—',
          cropName:      (t.listing_id as any)?.crop_name ?? '—',
          buyerName:     (t.buyer_id as any)?.name ?? '—',
          qtyKg:         t.quantity_kg,
          editing:       false,
          pendingStatus: t.status,
        }));
        this.stats.totalTransactions   = r.total;
        this.stats.reservationsPending = r.transactions.filter(t => t.status === 'pending').length;
      },
      error: () => {}
    });

    this.contactService.getAll().subscribe({
      next: r => {
        this.contactMessages = r.messages;
        this.stats.unreadMessages = r.unread;
      },
      error: () => {}
    });
  }

  // ── Verification edits ─────────────────────────────────────────
  startEditUser(u: EditableUser)   { u.pendingStatus = u.status; u.editing = true; }
  cancelEditUser(u: EditableUser)  { u.pendingStatus = u.status; u.editing = false; }
  confirmEditUser(u: EditableUser) {
    this.userService.updateVerification(u.id, u.pendingStatus).subscribe({
      next: () => { u.status = u.pendingStatus; u.editing = false; },
      error: () => { u.editing = false; }
    });
  }

  verifyUser(id: string) {
    this.userService.updateVerification(id, 'verified').subscribe({
      next: () => {
        const u = this.verifications.find(v => v.id === id);
        if (u) { u.status = 'verified'; u.pendingStatus = 'verified'; u.editing = false; }
      },
      error: () => {}
    });
  }

  // ── Listing edits ──────────────────────────────────────────────
  startEditListing(l: EditableListing)   { l.pendingStatus = l.status; l.editing = true; }
  cancelEditListing(l: EditableListing)  { l.pendingStatus = l.status; l.editing = false; }
  confirmEditListing(l: EditableListing) {
    this.listingService.updateStatus(l._id, l.pendingStatus).subscribe({
      next: () => { l.status = l.pendingStatus as any; l.editing = false; },
      error: () => { l.editing = false; }
    });
  }

  // ── Transaction edits ──────────────────────────────────────────
  startEditTxn(t: EditableTxn)   { t.pendingStatus = t.status; t.editing = true; }
  cancelEditTxn(t: EditableTxn)  { t.pendingStatus = t.status; t.editing = false; }
  confirmEditTxn(t: EditableTxn) {
    this.transactionService.updateStatus(t._id, t.pendingStatus).subscribe({
      next: () => { t.status = t.pendingStatus as any; t.editing = false; },
      error: () => { t.editing = false; }
    });
  }

  // ── Contact messages ───────────────────────────────────────────
  markContactRead(msg: ContactMessage) {
    if (msg.is_read) return;
    this.contactService.markRead(msg._id).subscribe({
      next: () => {
        msg.is_read = true;
        this.stats.unreadMessages = Math.max(0, this.stats.unreadMessages - 1);
      },
      error: () => {}
    });
  }

  deleteContact(msg: ContactMessage) {
    this.contactService.delete(msg._id).subscribe({
      next: () => {
        this.contactMessages = this.contactMessages.filter(m => m._id !== msg._id);
        if (!msg.is_read) this.stats.unreadMessages = Math.max(0, this.stats.unreadMessages - 1);
      },
      error: () => {}
    });
  }

  getStatusClass(status: string): string {
    const m: Record<string, string> = {
      available: 'pill-green',  reserved: 'pill-amber', sold_out: 'pill-orange', draft: 'pill-gray',
      processed: 'pill-green',  pending:  'pill-amber', cancelled: 'pill-red',
      verified:  'pill-green',  flagged:  'pill-red',   rejected:  'pill-red',
      confirmed: 'pill-green',  completed:'pill-teal',
    };
    return m[status] ?? 'pill-gray';
  }
}
