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
import { ToastComponent } from '../toast/toast.component';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink, ToastComponent],
  templateUrl: './signup.component.html',
  styleUrls: ['../../shared/auth.component.scss'],
})
export class SignupComponent {
  signupForm: FormGroup;
  formPassword: string = '';
  showformPassword: boolean = false;
  showToast = false;
  toastMessage = '';
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {
    this.signupForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
    });
  }

  onSubmit() {
    this.isLoading = true;
    const { email, password } = this.signupForm.value;
    this.authService
      .signup(email, password)
      .then(() => {
        this.toastMessage = 'Signup successful!';
        this.showToast = true;
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 1000);
      })
      .catch((error) => {
        console.error('Signup failed', error);
        alert('Invalid credentials or user already exists.');
      })
      .finally(() => (this.isLoading = false));
  }
}
