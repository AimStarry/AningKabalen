import { Component, HostListener, signal, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { CartService } from '../../../core/services/cart.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, FormsModule],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css']
})
export class NavbarComponent {
  auth     = inject(AuthService);
  cart     = inject(CartService);
  private router = inject(Router);

  menuOpen = false;
  deptOpen = false;
  searchTerm = '';

  departments = [
    { label: 'Fruits & Vegetables', slug: 'vegetables',  icon: '🥬' },
    { label: 'Fruits',              slug: 'fruits',       icon: '🍎' },
    { label: 'Grains',              slug: 'grains',       icon: '🌾' },
    { label: 'Nuts & Beans',        slug: 'nuts-grains',  icon: '🥜' },
    { label: 'Cheese, Dairy, Milk', slug: 'dairy',        icon: '🧀' },
    { label: 'Farm Produce',        slug: 'farm-produce', icon: '🌽' },
    { label: 'Root Crops',          slug: 'root-crops',   icon: '🥕' },
    { label: 'Herbs & Spices',      slug: 'herbs-spices', icon: '🌿' },
  ];

  // Stop propagation so document:click doesn't immediately close the dropdown
  toggleDept(e: Event) {
    e.stopPropagation();
    this.deptOpen = !this.deptOpen;
  }

  closeDept() { this.deptOpen = false; }

  @HostListener('document:click')
  onDocClick() { this.deptOpen = false; }

  search() {
    if (this.searchTerm.trim()) {
      this.router.navigate(['/products'], { queryParams: { search: this.searchTerm.trim() } });
      this.searchTerm = '';
    }
  }

  logout() { this.auth.logout(); }
}