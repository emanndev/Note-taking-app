import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private theme = 'light';
  private font = 'Noto Sans';

  setTheme(theme: string) {
    this.theme = theme;
    document.body.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }

  setFont(font: string) {
    this.font = font;
    document.body.style.fontFamily = font;
    localStorage.setItem('font', font);
  }

  getTheme() {
    return this.theme;
  }
  getFont() {
    return this.font;
  }
}
