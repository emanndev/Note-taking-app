import { Component } from '@angular/core';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent {
  theme = this.themeService.getTheme();
  font = this.themeService.getFont();
  newPassword = '';

  constructor(public themeService: ThemeService) {}

  setTheme(theme: string) {
    this.themeService.setTheme(theme);
    this.theme = theme;
  }

  setFont(font: string) {
    this.themeService.setFont(font);
    this.font = font;
  }

  changePassword() {
    if (this.newPassword) {
      console.log('Password changed to:', this.newPassword);
      this.newPassword = '';
      alert('Password updated successfully!');
    }
  }
}
