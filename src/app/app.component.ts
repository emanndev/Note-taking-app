import { Component, OnInit } from '@angular/core';
import { NoteService } from './services/note.service';
import { ThemeService } from './services/theme.service';
import { FormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FormsModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  isMobile = window.innerWidth < 768;
  sidebarCollapsed = false;
  searchQuery = '';
  filteredNotes: any[] = [];

  constructor(
    public noteService: NoteService,
    public themeService: ThemeService
  ) {}

  ngOnInit() {
    this.initializeTheme();
    this.onSearch();
  }

  toggleSidebar() {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }

  onSearch() {
    this.filteredNotes = this.noteService.filterNotes(this.searchQuery);
  }

  private initializeTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    const savedFont = localStorage.getItem('font') || 'Noto Sans';
    this.themeService.setTheme(savedTheme);
    this.themeService.setFont(savedFont);
  }
}
