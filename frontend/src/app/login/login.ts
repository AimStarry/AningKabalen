import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { trigger, transition, style, animate } from '@angular/animations';
import { AuthService } from '../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
  animations: [
    trigger('slideIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(-30px)' }),
        animate('500ms ease-out', style({ opacity: 1, transform: 'translateX(0)' }))
      ])
    ])
  ]
})
export class LoginComponent {
  isLogin      = true;
  email        = '';
  password     = '';
  name         = '';
  phone        = '';
  role: 'buyer' | 'farmer' = 'buyer';
  farmName     = '';
  showPassword = false;
  loading      = false;
  error        = '';

  private returnUrl = '/home';

  constructor(
    private auth: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] ?? '/home';
  }

  toggle() { this.isLogin = !this.isLogin; this.error = ''; }

  submit() {
    this.error   = '';
    this.loading = true;

    if (this.isLogin) {
      if (!this.email || !this.password) {
        this.error = 'Please enter your email and password.';
        this.loading = false;
        return;
      }
      this.auth.login(this.email, this.password).subscribe({
        next: (r) => {
          this.loading = false;
          this.navigateByRole(r.user.role);
        },
        error: (e) => {
          this.loading = false;
          this.error = e?.error?.message ?? 'Login failed. Check your credentials.';
        }
      });
    } else {
      if (!this.name || !this.email || !this.password || !this.phone) {
        this.error = 'Please fill in all fields.';
        this.loading = false;
        return;
      }
      if (this.role === 'farmer' && !this.farmName.trim()) {
        this.error = 'Please enter your farm name.';
        this.loading = false;
        return;
      }
      this.auth.register({
        name: this.name, email: this.email,
        phone: this.phone, password: this.password, role: this.role,
        ...(this.role === 'farmer' && {
          farm_details: { farm_name: this.farmName.trim() }
        }),
      }).subscribe({
        next: (r) => {
          this.loading = false;
          this.navigateByRole(r.user.role);
        },
        error: (e) => {
          this.loading = false;
          this.error = e?.error?.message ?? 'Registration failed. Try a different email.';
        }
      });
    }
  }

  private navigateByRole(role: string) {
    if      (role === 'admin')  this.router.navigate(['/admin']);
    else if (role === 'farmer') this.router.navigate(['/farmer']);
    else {
      const safe = this.returnUrl && !this.returnUrl.includes('admin') && !this.returnUrl.includes('farmer');
      this.router.navigateByUrl(safe ? this.returnUrl : '/home');
    }
  }
}