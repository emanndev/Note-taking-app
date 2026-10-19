import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  AbstractControl,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './reset-password.component.html',
  styleUrls: ['../../shared/auth.component.scss'],
})
export class ResetPasswordComponent implements OnInit {
  form: FormGroup;
  showNewPassword: boolean = false;
  showConfirmPassword: boolean = false;
  message: string = '';
  isLoading: boolean = false;
  isSuccess: boolean = false;

  public oobCode: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private toastService: ToastService
  ) {
    this.form = this.fb.group(
      {
        newPassword: ['', [Validators.required, Validators.minLength(8)]],
        confirmPassword: ['', Validators.required],
      },
      { validators: this.passwordMatch }
    );
  }

  ngOnInit() {
    // Firebase appends ?oobCode=xxx&mode=resetPassword to the reset link
    this.oobCode = this.route.snapshot.queryParamMap.get('oobCode');

    if (!this.oobCode) {
      this.message =
        'Invalid or expired reset link. Please request a new one.';
      this.isSuccess = false;
      this.toastService.error('Invalid or expired reset link.');
    }
  }

  passwordMatch(group: AbstractControl) {
    const password = group.get('newPassword')?.value;
    const confirm = group.get('confirmPassword')?.value;
    return password === confirm ? null : { mismatch: true };
  }

  async onSubmit() {
    if (this.form.invalid || !this.oobCode) return;

    this.isLoading = true;
    this.message = '';

    const newPassword = this.form.value.newPassword;

    try {
      await this.authService.confirmPasswordReset(this.oobCode, newPassword);
      this.isSuccess = true;
      this.message = 'Password reset successfully! Redirecting to login...';
      this.toastService.success('Password reset successfully!');
      this.form.reset();
      setTimeout(() => this.router.navigate(['/login']), 2000);
    } catch (error: any) {
      this.isSuccess = false;
      this.message = this.getFriendlyError(error.code);
      this.toastService.error(this.message);
    } finally {
      this.isLoading = false;
    }
  }

  private getFriendlyError(code: string): string {
    switch (code) {
      case 'auth/expired-action-code':
        return 'This reset link has expired. Please request a new one.';
      case 'auth/invalid-action-code':
        return 'This reset link is invalid or already used. Please request a new one.';
      case 'auth/weak-password':
        return 'Password is too weak. Please choose a stronger password.';
      default:
        return 'An error occurred. Please try again.';
    }
  }
}
