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
  formPassword: string = '';
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
        this.toastService.success('Signup successful! Please log in.');
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 800);
      })
      .catch((error) => {
        console.error('Signup failed', error);
        this.toastService.error('Invalid credentials or user already exists.');
      })
      .finally(() => (this.isLoading = false));
  }
}
