import { Component, HostListener, inject } from '@angular/core';
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

  /* ================= SERVICES ================= */
  auth = inject(AuthService);
  cart = inject(CartService);
  private router = inject(Router);

  /* ================= STATE ================= */
  menuOpen = false;
  deptOpen = false;
  searchTerm = '';

  /* ================= CATEGORY LIST ================= */
  departments = [
    { label: 'Fruits & Vegetables', slug: 'vegetables',  icon: '🥬' },
    { label: 'Fruits',              slug: 'fruits',      icon: '🍎' },
    { label: 'Grains',              slug: 'grains',      icon: '🌾' },
    { label: 'Nuts & Beans',        slug: 'nuts-grains', icon: '🥜' },
    { label: 'Cheese, Dairy, Milk', slug: 'dairy',       icon: '🧀' },
    { label: 'Farm Produce',        slug: 'farm-produce',icon: '🌽' },
    { label: 'Root Crops',          slug: 'root-crops',  icon: '🥕' },
    { label: 'Herbs & Spices',      slug: 'herbs-spices',icon: '🌿' },
  ];

  /* ================= DROPDOWN TOGGLE ================= */
  toggleDept(event: MouseEvent) {
    event.stopPropagation();
    this.deptOpen = !this.deptOpen;
  }

  closeDept() {
    this.deptOpen = false;
  }

  @HostListener('document:click', ['$event'])
onDocumentClick(event: MouseEvent) {
  const clickedElement = event.target as HTMLElement;

  // only close if click is OUTSIDE the category button area
  if (!clickedElement.closest('.dept-wrap')) {
    this.deptOpen = false;
  }
}



  /* ================= SEARCH ================= */
  search() {
    if (!this.searchTerm.trim()) return;

    this.router.navigate(['/products'], {
      queryParams: { search: this.searchTerm.trim() }
    });

    this.searchTerm = '';
  }

  /* ================= LOGOUT ================= */
  logout() {
    this.auth.logout();
  }
}