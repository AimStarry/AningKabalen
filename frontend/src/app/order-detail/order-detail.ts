import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { trigger, transition, style, animate } from '@angular/animations';
import { NavbarComponent } from '../shared/components/navbar/navbar';
import { FooterComponent } from '../shared/components/footer/footer';
import { TransactionService, ApiTransaction } from '../core/services/transaction.service';

@Component({
  selector: 'app-order-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, NavbarComponent, FooterComponent],
  templateUrl: './order-detail.html',
  styleUrls: ['./order-detail.css'],
  animations: [trigger('fadeUp', [transition(':enter', [style({ opacity: 0, transform: 'translateY(20px)' }), animate('400ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))])])]
})
export class OrderDetailComponent implements OnInit {
  transaction: ApiTransaction | null = null;
  loading = true;

  constructor(private route: ActivatedRoute, private txnService: TransactionService) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.txnService.getMy().subscribe({
      next: r => { this.transaction = r.transactions.find(t => t._id === id) ?? null; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }

  getCropName()    { return (this.transaction?.listing_id as any)?.crop_name ?? '—'; }
  getCropImage()   { return (this.transaction?.listing_id as any)?.images?.[0] ?? 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=300'; }
  getFarmerName()  { return (this.transaction?.farmer_id as any)?.name ?? '—'; }
  getFarmName()    { return (this.transaction?.farmer_id as any)?.farm_details?.farm_name ?? '—'; }

  getStatusClass(s: string) {
    const m: Record<string,string> = { completed:'pill-teal', processed:'pill-green', confirmed:'pill-green', pending:'pill-amber', cancelled:'pill-red' };
    return m[s] ?? 'pill-gray';
  }
}
