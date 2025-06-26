import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ThemeService } from '../../services/theme.service';
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
    private authService: AuthService
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
  }

  setFont(font: string) {
    this.font = font;
    this.themeService.setFont(font);
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
      alert('Please fill all fields correctly.');
      return;
    }

    if (this.newPassword !== this.confirmPassword) {
      alert('New passwords do not match.');
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

    alert('Password updated successfully!');
  }

  logout() {
    if (confirm('Are you sure you want to logout?')) {
      console.log('User logged out');
      this.authService.logout();
      this.router.navigate(['/login']);
    }
  }
}
