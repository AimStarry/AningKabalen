import { Component, Input, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.html',
  styleUrls: ['./sidebar.css']
})
export class SidebarComponent {
  @Input() role: 'farmer' | 'admin' = 'admin';
  auth = inject(AuthService);

  get userName()     { return this.auth.currentUser()?.name ?? 'Admin'; }
  get userInitials() { return this.userName.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase(); }

  adminNav = [
    { label: 'Dashboard',    icon: '◉', route: '/admin' },
    { label: 'Verifications',icon: '✓', route: '/admin' },
    { label: 'Listings',     icon: '🌾', route: '/admin' },
    { label: 'Transactions', icon: '💳', route: '/admin' },
  ];

  logout() { this.auth.logout(); }
}
