import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
<footer class="footer">
  <div class="footer-main">
    <div class="footer-brand">
      <div class="f-logo">🌿 AningKabalen</div>
      <p class="f-tagline">Connecting Filipino farmers directly with buyers. Fresh, fair, and transparent.</p>
      <div class="f-socials">
        <a href="#" class="f-social">FB</a>
        <a href="#" class="f-social">IG</a>
        <a href="#" class="f-social">TW</a>
      </div>
    </div>
    <div class="footer-links">
      <div class="f-group">
        <h4>Marketplace</h4>
        <a routerLink="/products">All Products</a>
        <a routerLink="/view-all">All Listings</a>
        <a routerLink="/reservation">Reserve Crops</a>
        <a routerLink="/cart">My Cart</a>
      </div>
      <div class="f-group">
        <h4>Account</h4>
        <a routerLink="/login">Sign In</a>
        <a routerLink="/profile">My Orders</a>
        <a routerLink="/farmer">Farmer Portal</a>
        <a routerLink="/admin">Admin</a>
      </div>
      <div class="f-group">
        <h4>Company</h4>
        <a routerLink="/about">About Us</a>
        <a routerLink="/contact">Contact</a>
        <a href="#">Privacy Policy</a>
        <a href="#">Terms of Service</a>
      </div>
    </div>
  </div>
  <div class="footer-bottom">
    <p>© {{ year }} AningKabalen. Built with ❤️ for Filipino farmers.</p>
    <p class="f-tech">Powered by Angular 20 · Node.js · MongoDB</p>
  </div>
</footer>
  `,
  styles: [`
.footer{background:var(--forest);color:rgba(255,255,255,.8);font-family:var(--font-sans)}
.footer-main{display:grid;grid-template-columns:280px 1fr;gap:48px;padding:52px 5% 36px;border-bottom:1px solid rgba(255,255,255,.1)}
.f-logo{font-family:var(--font-display);font-size:1.4rem;font-weight:700;color:#fff;margin-bottom:12px}
.f-tagline{font-size:.85rem;line-height:1.7;opacity:.7;margin-bottom:20px;max-width:260px}
.f-socials{display:flex;gap:8px}
.f-social{width:34px;height:34px;border-radius:var(--r-sm);background:rgba(255,255,255,.1);display:flex;align-items:center;justify-content:center;font-size:.7rem;font-weight:700;color:#fff;transition:background var(--dur);text-decoration:none}
.f-social:hover{background:var(--g600)}
.footer-links{display:grid;grid-template-columns:repeat(3,1fr);gap:32px}
.f-group h4{font-size:.72rem;font-weight:700;letter-spacing:1.2px;text-transform:uppercase;color:var(--g300);margin-bottom:14px}
.f-group a{display:block;font-size:.85rem;color:rgba(255,255,255,.6);margin-bottom:9px;transition:color var(--dur-fast);text-decoration:none}
.f-group a:hover{color:#fff}
.footer-bottom{display:flex;align-items:center;justify-content:space-between;padding:16px 5%;font-size:.78rem;opacity:.5;flex-wrap:wrap;gap:8px}
.f-tech{font-size:.72rem}
@media(max-width:768px){.footer-main{grid-template-columns:1fr}.footer-links{grid-template-columns:repeat(2,1fr)}.footer-bottom{flex-direction:column;text-align:center}}
  `]
})
export class FooterComponent {
  year = new Date().getFullYear();
}
