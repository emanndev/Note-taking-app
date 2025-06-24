import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ThemeService } from './services/theme.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(public themeService: ThemeService) {}

  ngOnInit() {
    this.initializeTheme();
  }

  private initializeTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    const savedFont = localStorage.getItem('font') || 'Noto Sans';
    this.themeService.setTheme(savedTheme);
    this.themeService.setFont(savedFont);
  }
}
