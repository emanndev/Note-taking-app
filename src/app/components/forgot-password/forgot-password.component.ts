import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './forgot-password.component.html',
  styleUrls: ['../../shared/auth.component.scss'],
})
export class ForgotPasswordComponent {
  form: FormGroup;
  message: string = '';
  isLoading: boolean = false;
  isSuccess: boolean = false;

  constructor(private fb: FormBuilder, private authService: AuthService) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  async onSubmit() {
    if (this.form.invalid) return;

    this.isLoading = true;
    this.message = '';
    this.isSuccess = false;

    const email = this.form.value.email;

    try {
      await this.authService.sendPasswordResetEmail(email);
      this.isSuccess = true;
      this.message = 'A password reset link has been sent to your email!';
      this.form.reset();
    } catch (error: any) {
      this.isSuccess = false;
      this.message = this.getFriendlyError(error.code);
    } finally {
      this.isLoading = false;
    }
  }

  private getFriendlyError(code: string): string {
    switch (code) {
      case 'auth/user-not-found':
        return 'No account found with this email address.';
      case 'auth/invalid-email':
        return 'The email address is not valid.';
      case 'auth/too-many-requests':
        return 'Too many attempts. Please try again later.';
      default:
        return 'An error occurred. Please try again.';
    }
  }
}
