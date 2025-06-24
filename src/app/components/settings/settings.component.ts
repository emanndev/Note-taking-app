import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ThemeService } from '../../services/theme.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

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

  // Password form fields
  oldPassword: string = '';
  newPassword: string = '';
  confirmPassword: string = '';

  // Password visibility toggles
  showOldPassword: boolean = false;
  showNewPassword: boolean = false;
  showConfirmPassword: boolean = false;

  constructor(public themeService: ThemeService, private router: Router) {
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

    // Here you would typically make an API call to change the password
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
      // Here you would typically:
      // 1. Clear any stored authentication tokens
      // 2. Clear user session data
      // 3. Navigate to login page

      console.log('User logged out');
      this.router.navigate(['/login']); // Adjust route as needed
    }
  }
}
