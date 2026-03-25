import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { trigger, transition, style, animate, stagger, query } from '@angular/animations';
import { NavbarComponent } from '../shared/components/navbar/navbar';
import { FooterComponent } from '../shared/components/footer/footer';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, RouterLink, NavbarComponent, FooterComponent],
  templateUrl: './about.html',
  styleUrls: ['./about.css'],
  animations: [
    trigger('fadeUp', [transition(':enter', [style({ opacity: 0, transform: 'translateY(28px)' }), animate('500ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))])]),
    trigger('staggerIn', [transition(':enter', [query('.step', [style({ opacity: 0, transform: 'translateY(20px)' }), stagger(100, animate('400ms ease-out', style({ opacity: 1, transform: 'translateY(0)' })))], { optional: true })])])
  ]
})
export class AboutComponent {
  steps = [
    { num: '01', icon: '🔍', title: 'Browse Listings', desc: 'Explore fresh crops from verified Filipino farmers — filter by category, location, or farm.' },
    { num: '02', icon: '🛒', title: 'Add to Cart or Reserve', desc: 'Buy available stock directly, or pre-book upcoming harvests with our reservation system.' },
    { num: '03', icon: '✅', title: 'Farmer Confirms', desc: 'For reservations, your chosen farmer confirms within 48 hours and schedules your pickup.' },
    { num: '04', icon: '🚚', title: 'Receive Fresh Produce', desc: 'Pick up from the farm or arrange delivery. Pay at pickup — no hidden charges.' },
  ];

  testimonials = [
    { stars: 5, quote: 'AningKabalen changed how I buy vegetables. The mangoes from Masagana Farm are the freshest I have ever tasted — and I paid half what I used to at the market!', name: 'Carlos Lim', role: 'Buyer · Quezon City', avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&q=80' },
    { stars: 5, quote: 'As a farmer, I now sell directly to buyers without going through traders. My income increased by 40% in the first month. This platform is a game changer.', name: 'Aimee Santos', role: 'Farmer · Benguet', avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&q=80' },
    { stars: 4, quote: 'The reservation feature is brilliant — I can pre-book my monthly supply of rice and vegetables directly from the farm. Consistent quality every time.', name: 'Joemar Diaz', role: 'Wholesale Buyer · Cebu', avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&q=80' },
  ];

  stats = [
    { num: '500+', label: 'Verified Farmers' },
    { num: '2,000+', label: 'Happy Buyers' },
    { num: '₱0', label: 'Middleman Markup' },
    { num: '2%', label: 'Platform Fee Only' },
  ];

  activeTestimonial = 0;
  prev() { this.activeTestimonial = (this.activeTestimonial - 1 + this.testimonials.length) % this.testimonials.length; }
  next() { this.activeTestimonial = (this.activeTestimonial + 1) % this.testimonials.length; }
}
