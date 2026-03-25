import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { trigger, transition, style, animate } from '@angular/animations';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  animations: [
    trigger('slideIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(110%)' }),
        animate('300ms cubic-bezier(.34,1.56,.64,1)', style({ opacity: 1, transform: 'translateX(0)' }))
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({ opacity: 0, transform: 'translateX(110%)' }))
      ])
    ])
  ],
  template: `
<div class="toast-container">
  <div class="toast" *ngFor="let t of svc.toasts()"
       [class]="'toast-' + t.type"
       @slideIn
       (click)="svc.remove(t.id)">
    <div class="toast-icon">
      <span *ngIf="t.type==='success'">✓</span>
      <span *ngIf="t.type==='error'">✕</span>
      <span *ngIf="t.type==='warning'">⚠</span>
      <span *ngIf="t.type==='info'">ℹ</span>
    </div>
    <div class="toast-body">
      <p class="toast-title">{{ t.title }}</p>
      <p class="toast-msg" *ngIf="t.message">{{ t.message }}</p>
    </div>
    <button class="toast-close" (click)="svc.remove(t.id)">×</button>
  </div>
</div>
  `,
  styles: [`
.toast-container {
  position: fixed; bottom: 24px; right: 24px; z-index: 9999;
  display: flex; flex-direction: column; gap: 10px; max-width: 360px;
}
.toast {
  display: flex; align-items: flex-start; gap: 12px;
  padding: 14px 16px; border-radius: 12px;
  background: #fff; box-shadow: 0 8px 32px rgba(0,0,0,.15);
  border-left: 4px solid; cursor: pointer;
  font-family: 'DM Sans', sans-serif;
  transition: box-shadow .2s;
}
.toast:hover { box-shadow: 0 12px 40px rgba(0,0,0,.2); }
.toast-success { border-left-color: #16a34a; }
.toast-error   { border-left-color: #ef4444; }
.toast-warning { border-left-color: #f59e0b; }
.toast-info    { border-left-color: #3b82f6; }
.toast-icon {
  width: 28px; height: 28px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-size: .85rem; font-weight: 800; flex-shrink: 0;
}
.toast-success .toast-icon { background: #dcfce7; color: #16a34a; }
.toast-error   .toast-icon { background: #fee2e2; color: #dc2626; }
.toast-warning .toast-icon { background: #fef9c3; color: #d97706; }
.toast-info    .toast-icon { background: #dbeafe; color: #2563eb; }
.toast-body  { flex: 1; min-width: 0; }
.toast-title { font-size: .875rem; font-weight: 700; color: #111827; line-height: 1.3; }
.toast-msg   { font-size: .78rem;  color: #6b7280;  margin-top: 3px; line-height: 1.4; }
.toast-close { background: none; border: none; cursor: pointer; color: #9ca3af; font-size: 1.2rem; padding: 0; line-height: 1; flex-shrink: 0; margin-top: -2px; transition: color .15s; }
.toast-close:hover { color: #374151; }
@media(max-width:480px) { .toast-container { left: 16px; right: 16px; max-width: none; } }
  `]
})
export class ToastComponent {
  svc = inject(ToastService);
}
