import { Injectable, signal } from '@angular/core';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface Toast {
  id: number;
  type: ToastType;
  title: string;
  message?: string;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  private counter = 0;
  toasts = signal<Toast[]>([]);

  private add(type: ToastType, title: string, message?: string, duration = 3500) {
    const id = ++this.counter;
    this.toasts.update(t => [...t, { id, type, title, message }]);
    setTimeout(() => this.remove(id), duration);
  }

  success(title: string, message?: string) { this.add('success', title, message); }
  error  (title: string, message?: string) { this.add('error',   title, message, 5000); }
  info   (title: string, message?: string) { this.add('info',    title, message); }
  warning(title: string, message?: string) { this.add('warning', title, message); }

  remove(id: number) {
    this.toasts.update(t => t.filter(x => x.id !== id));
  }
}
