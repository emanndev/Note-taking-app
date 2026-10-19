import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './signup.component.html',
  styleUrls: ['../../shared/auth.component.scss'],
})
export class SignupComponent {
  signupForm: FormGroup;
  showformPassword: boolean = false;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private toastService: ToastService
  ) {
    this.signupForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
    });
  }

  onSubmit() {
    if (this.signupForm.invalid) return;

    this.isLoading = true;
    const { email, password } = this.signupForm.value;

    this.authService
      .signup(email, password)
      .then(() => {
        this.toastService.success(
          'Account created! A verification link has been sent to your email.'
        );
        setTimeout(() => {
          this.router.navigate(['/verify-email']);
        }, 700);
      })
      .catch((error) => {
        console.error('Signup failed', error);
        let message = 'Signup failed. Please try again.';
        if (error.code === 'auth/email-already-in-use') {
          message = 'An account with this email address already exists.';
        } else if (error.code === 'auth/invalid-email') {
          message = 'The email address is not valid.';
        } else if (error.code === 'auth/weak-password') {
          message = 'Password is too weak. Please use at least 8 characters.';
        }
        this.toastService.error(message);
      })
      .finally(() => (this.isLoading = false));
  }
}
