import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private theme = 'light';
  private font = 'Noto Sans';

  constructor() {
    // Initialize with saved preferences or defaults
    this.loadSavedPreferences();
  }

  setTheme(theme: string) {
    this.theme = theme;

    if (theme === 'system') {
      // Detect system preference
      const systemPrefersDark = window.matchMedia(
        '(prefers-color-scheme: dark)'
      ).matches;
      const actualTheme = systemPrefersDark ? 'dark' : 'light';
      document.body.setAttribute('data-theme', actualTheme);
    } else {
      document.body.setAttribute('data-theme', theme);
    }

    // Save preference
    localStorage.setItem('theme', theme);
  }

  setFont(font: string) {
    this.font = font;

    // Map font names to actual font families
    const fontMap: { [key: string]: string } = {
      'Noto Sans':
        '"Noto Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      'Noto Serif': '"Noto Serif", Georgia, "Times New Roman", serif',
      Monaco: '"Monaco", "Courier New", Consolas, monospace',
    };

    document.body.style.fontFamily = fontMap[font] || fontMap['Noto Sans'];

    // Save preference
    localStorage.setItem('font', font);
  }

  getTheme(): string {
    return this.theme;
  }

  getFont(): string {
    return this.font;
  }

  private loadSavedPreferences() {
    // Load saved theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      this.setTheme(savedTheme);
    } else {
      this.setTheme('light');
    }

    // Load saved font
    const savedFont = localStorage.getItem('font');
    if (savedFont) {
      this.setFont(savedFont);
    } else {
      this.setFont('Noto Sans');
    }

    // Listen for system theme changes if user selected 'system'
    if (this.theme === 'system') {
      window
        .matchMedia('(prefers-color-scheme: dark)')
        .addEventListener('change', (e) => {
          this.setTheme('system'); // Re-apply system theme
        });
    }
  }
}
