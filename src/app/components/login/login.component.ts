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
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink, ToastComponent],
  templateUrl: './login.component.html',
  styleUrls: ['../../shared/auth.component.scss'],
})
export class LoginComponent {
  loginForm: FormGroup;
  showToast = false;
  toastMessage = '';
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  onSubmit() {
    this.isLoading = true;
    const { email, password } = this.loginForm.value;
    this.authService
      .login(email, password)
      .then(() => {
        this.toastMessage = 'Login successful!';
        this.showToast = true;
        setTimeout(() => {
          this.router.navigate(['/dashboard/notes']);
        }, 1000);
      })
      .catch((error) => {
        console.error('Login failed', error);
        alert('Invalid credentials or user does not exist.');
      })
      .finally(() => (this.isLoading = false));
  }
}
