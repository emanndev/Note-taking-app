import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ThemeService } from '../../services/theme.service';
import { ToastService } from '../../services/toast.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent {
  theme: string;
  font: string;
  activeSection: string | null = null;

  oldPassword: string = '';
  newPassword: string = '';
  confirmPassword: string = '';

  showOldPassword: boolean = false;
  showNewPassword: boolean = false;
  showConfirmPassword: boolean = false;

  constructor(
    public themeService: ThemeService,
    private router: Router,
    private authService: AuthService,
    private toastService: ToastService
  ) {
    this.theme = this.themeService.getTheme() || 'light';
    this.font = this.themeService.getFont() || 'Noto Sans';
  }

  toggleSection(section: string) {
    this.activeSection = this.activeSection === section ? null : section;
  }

  setTheme(theme: string) {
    this.theme = theme;
    this.themeService.setTheme(theme);
    const label = theme === 'system' ? 'System Theme' : theme.charAt(0).toUpperCase() + theme.slice(1);
    this.toastService.info(`Theme set to ${label}`);
  }

  setFont(font: string) {
    this.font = font;
    this.themeService.setFont(font);
    this.toastService.info(`Font updated to ${font}`);
  }

  isPasswordFormValid(): boolean {
    return (
      this.oldPassword.length > 0 &&
      this.newPassword.length >= 8 &&
      this.confirmPassword === this.newPassword
    );
  }

  changePassword() {
    if (!this.isPasswordFormValid()) {
      this.toastService.warning('Please fill all fields correctly (minimum 8 characters).');
      return;
    }

    if (this.newPassword !== this.confirmPassword) {
      this.toastService.error('New passwords do not match.');
      return;
    }

    console.log('Password change requested');

    // Reset form
    this.oldPassword = '';
    this.newPassword = '';
    this.confirmPassword = '';
    this.showOldPassword = false;
    this.showNewPassword = false;
    this.showConfirmPassword = false;
    this.activeSection = null;

    this.toastService.success('Password updated successfully!');
  }

  logout() {
    if (confirm('Are you sure you want to logout?')) {
      console.log('User logged out');
      this.toastService.info('Logged out successfully.');
      this.authService.logout();
      this.router.navigate(['/login']);
    }
  }
}
