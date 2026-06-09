import { ChangeDetectorRef, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  name = '';
  email = '';
  password = '';
  confirmPassword = '';
  error = '';

  constructor(private authService: AuthService, private router: Router, private cdr: ChangeDetectorRef) {}

  register() {
    this.error = '';
    this.authService.register(this.name, this.email, this.password, this.confirmPassword).subscribe({
      next: () => this.router.navigate(['/login']),
      error: (err) => {
        this.error = typeof err?.error === 'string' ? err.error : 'Registration failed';
        this.cdr.markForCheck();
      }
    });
  }
}
