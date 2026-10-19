import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrls: ['../../shared/auth.component.scss', './login.component.scss'],
})
export class LoginComponent {
  loginForm: FormGroup;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    private toastService: ToastService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      rememberMe: [true],
    });
  }

  onSubmit() {
    if (this.loginForm.invalid) return;

    this.isLoading = true;
    const { email, password, rememberMe } = this.loginForm.value;

    this.authService
      .login(email, password, !!rememberMe)
      .then((credential) => {
        if (!credential.user.emailVerified) {
          this.toastService.info(
            'Please verify your email address to access your notes.'
          );
          this.router.navigate(['/verify-email']);
          return;
        }

        this.toastService.success('Login successful! Redirecting...');
        const returnUrl =
          this.route.snapshot.queryParams['returnUrl'] || '/dashboard/notes';
        setTimeout(() => {
          this.router.navigateByUrl(returnUrl);
        }, 600);
      })
      .catch((error) => {
        console.error('Login failed', error);
        let message = 'Invalid credentials or user does not exist.';
        if (error.code === 'auth/wrong-password' || error.code === 'auth/user-not-found' || error.code === 'auth/invalid-credential') {
          message = 'Invalid email or password.';
        } else if (error.code === 'auth/too-many-requests') {
          message = 'Too many attempts. Please try again later.';
        }
        this.toastService.error(message);
      })
      .finally(() => (this.isLoading = false));
  }
}
