import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-farmer-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './farmer-navbar.html',
  styleUrls: ['./farmer-navbar.css']
})
export class FarmerNavbarComponent {
  auth = inject(AuthService);
}
