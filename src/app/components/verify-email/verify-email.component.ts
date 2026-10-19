import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-verify-email',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './verify-email.component.html',
  styleUrls: ['../../shared/auth.component.scss', './verify-email.component.scss'],
})
export class VerifyEmailComponent implements OnInit, OnDestroy {
  userEmail: string = '';
  isChecking: boolean = false;
  isResending: boolean = false;
  resendCooldown: number = 0;

  private timerInterval?: any;
  private userSub?: Subscription;

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.userSub = this.authService.user$.subscribe((user) => {
      if (!user) {
        this.router.navigate(['/login']);
        return;
      }

      this.userEmail = user.email || '';

      if (user.emailVerified) {
        this.toastService.success('Email is verified! Redirecting to your notes...');
        this.router.navigate(['/dashboard/notes']);
      }
    });
  }

  ngOnDestroy(): void {
    this.userSub?.unsubscribe();
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
  }

  async checkVerification(): Promise<void> {
    this.isChecking = true;
    try {
      const refreshedUser = await this.authService.reloadUser();
      if (refreshedUser?.emailVerified) {
        this.toastService.success('Email verified successfully! Welcome to Note.');
        this.router.navigate(['/dashboard/notes']);
      } else {
        this.toastService.warning(
          'Email not verified yet. Please click the link sent to your inbox.'
        );
      }
    } catch (error: any) {
      this.toastService.error(
        error.message || 'Failed to check verification status.'
      );
    } finally {
      this.isChecking = false;
    }
  }

  async resendVerification(): Promise<void> {
    if (this.resendCooldown > 0 || this.isResending) {
      return;
    }

    this.isResending = true;
    try {
      await this.authService.sendVerificationEmail();
      this.toastService.success(
        'A new verification link has been sent to your email.'
      );
      this.startCooldown(60);
    } catch (error: any) {
      if (error.code === 'auth/too-many-requests') {
        this.toastService.error(
          'Too many requests. Please wait a moment before trying again.'
        );
        this.startCooldown(60);
      } else {
        this.toastService.error(
          error.message || 'Could not send verification email.'
        );
      }
    } finally {
      this.isResending = false;
    }
  }

  private startCooldown(seconds: number): void {
    this.resendCooldown = seconds;
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
    this.timerInterval = setInterval(() => {
      this.resendCooldown--;
      if (this.resendCooldown <= 0) {
        clearInterval(this.timerInterval);
        this.timerInterval = undefined;
      }
    }, 1000);
  }

  logout(): void {
    this.authService.logout();
  }
}
