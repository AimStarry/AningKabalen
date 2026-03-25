import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { trigger, transition, style, animate } from '@angular/animations';
import { NavbarComponent } from '../shared/components/navbar/navbar';
import { FooterComponent } from '../shared/components/footer/footer';
import { ToastService } from '../core/services/toast.service';
import { ContactService } from '../core/services/contact.service';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, NavbarComponent, FooterComponent],
  templateUrl: './contact.html',
  styleUrls: ['./contact.css'],
  animations: [trigger('fadeUp', [transition(':enter', [style({ opacity: 0, transform: 'translateY(24px)' }), animate('450ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))])])]
})
export class ContactComponent {
  submitted = false;
  loading = false;
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private toast: ToastService,
    private contactService: ContactService
  ) {
    this.form = this.fb.group({
      firstName: ['', Validators.required],
      lastName:  ['', Validators.required],
      email:     ['', [Validators.required, Validators.email]],
      phone:     ['', Validators.required],
      message:   ['', [Validators.required, Validators.minLength(10)]],
    });
  }

  onSubmit() {
    if (this.form.valid) {
      this.loading = true;
      this.contactService.submit(this.form.value).subscribe({
        next: () => {
          this.submitted = true;
          this.loading = false;
          this.form.reset();
          this.toast.success('Message Sent! ✉️', "We'll get back to you within 24 hours.");
        },
        error: () => {
          this.loading = false;
          this.toast.error('Failed to send message. Please try again.');
        }
      });
    } else {
      this.form.markAllAsTouched();
      this.toast.error('Please fill in all required fields.');
    }
  }

  onClear() { this.form.reset(); this.submitted = false; }
  hasError(f: string) { const c = this.form.get(f); return c?.invalid && c.touched; }
}
