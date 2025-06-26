import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private theme = 'light';
  private font = 'Noto Sans';
  private systemThemeListener?: MediaQueryList;

  constructor() {
    this.loadSavedPreferences();
  }

  setTheme(theme: string) {
    this.theme = theme;

    // Remove existing system theme listener
    if (this.systemThemeListener) {
      this.systemThemeListener.removeEventListener(
        'change',
        this.handleSystemThemeChange
      );
    }

    if (theme === 'system') {
      // Detect system preference
      this.systemThemeListener = window.matchMedia(
        '(prefers-color-scheme: dark)'
      );
      const systemPrefersDark = this.systemThemeListener.matches;
      const actualTheme = systemPrefersDark ? 'dark' : 'light';
      document.body.setAttribute('data-theme', actualTheme);

      // Listen for system theme changes
      this.systemThemeListener.addEventListener(
        'change',
        this.handleSystemThemeChange
      );
    } else {
      document.body.setAttribute('data-theme', theme);
    }

    // Save preference
    localStorage.setItem('theme', theme);
    window.dispatchEvent(
      new CustomEvent('themeChanged', { detail: { theme } })
    );
  }

  setFont(font: string) {
    this.font = font;
    const fontMap: { [key: string]: string } = {
      'Noto Sans':
        '"Noto Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      'Noto Serif': '"Noto Serif", Georgia, "Times New Roman", serif',
      Monaco: '"Monaco", "Courier New", Consolas, monospace',
    };

    const fontFamily = fontMap[font] || fontMap['Noto Sans'];
    document.documentElement.style.setProperty('--font-family', fontFamily);
    document.body.style.fontFamily = fontFamily;

    // Save preference
    localStorage.setItem('font', font);

    // Emit font change event
    window.dispatchEvent(new CustomEvent('fontChanged', { detail: { font } }));
  }

  getTheme(): string {
    return this.theme;
  }

  getFont(): string {
    return this.font;
  }

  getCurrentTheme(): 'light' | 'dark' {
    if (this.theme === 'system') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';
    }
    return this.theme as 'light' | 'dark';
  }

  private handleSystemThemeChange = (e: MediaQueryListEvent) => {
    const actualTheme = e.matches ? 'dark' : 'light';
    document.body.setAttribute('data-theme', actualTheme);
    window.dispatchEvent(
      new CustomEvent('themeChanged', {
        detail: { theme: 'system', actualTheme },
      })
    );
  };

  private loadSavedPreferences() {
    // Load saved theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme && ['light', 'dark', 'system'].includes(savedTheme)) {
      this.setTheme(savedTheme);
    } else {
      // Default to system preference if no saved theme
      this.setTheme('system');
    }
    const savedFont = localStorage.getItem('font');
    if (
      savedFont &&
      ['Noto Sans', 'Noto Serif', 'Monaco'].includes(savedFont)
    ) {
      this.setFont(savedFont);
    } else {
      this.setFont('Noto Sans');
    }
  }

  isDarkMode(): boolean {
    return this.getCurrentTheme() === 'dark';
  }
  toggleTheme() {
    const newTheme = this.getCurrentTheme() === 'dark' ? 'light' : 'dark';
    this.setTheme(newTheme);
  }
}
