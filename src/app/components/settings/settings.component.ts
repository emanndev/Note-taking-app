import { Component } from '@angular/core';
import { ThemeService } from '../../services/theme.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent {
  theme: string;
  font: string;
  newPassword: string = '';

  constructor(public themeService: ThemeService) {
    this.theme = this.themeService.getTheme() || 'light';
    this.font = this.themeService.getFont() || 'Noto Sans';
  }

  setTheme(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target.value) {
      this.themeService.setTheme(target.value);
      this.theme = target.value;
    }
  }

  setFont(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target.value) {
      this.themeService.setFont(target.value);
      this.font = target.value;
    }
  }

  changePassword() {
    if (this.newPassword) {
      console.log('Password changed to:', this.newPassword);
      this.newPassword = '';
      alert('Password updated successfully!');
    } else {
      alert('Please enter a new password.');
    }
  }
}
