import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { NoteService } from '../../services/note.service';
import { ThemeService } from '../../services/theme.service';
import { FormsModule } from '@angular/forms';
import { RouterOutlet, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Note } from '../../models/note.interface';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [FormsModule, RouterOutlet, RouterLink, CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  isMobile = window.innerWidth < 768;
  sidebarCollapsed = false;
  searchQuery = '';
  filteredNotes: Note[] = [];
  selectedNoteId: string | null = null;
  currentSection: 'all' | 'archived' = 'all';
  selectedTag: string | null = null;
  hasSearchResults = true;

  constructor(
    public noteService: NoteService,
    public themeService: ThemeService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.onSearch();
    // Trigger change detection after notes are loaded
    setTimeout(() => this.cdr.detectChanges(), 1000);
  }

  toggleSidebar() {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }

  onSearch() {
    if (this.searchQuery.trim()) {
      this.filteredNotes = this.noteService.filterNotes(this.searchQuery);
      this.hasSearchResults = this.filteredNotes.length > 0;
    } else {
      this.filteredNotes =
        this.currentSection === 'all'
          ? this.noteService.getNotes()
          : this.noteService.getArchivedNotes();
      this.hasSearchResults = true;
    }
  }

  selectNote(noteId: string) {
    this.selectedNoteId = noteId;
    this.router.navigate(['/dashboard/notes', noteId]);
  }

  setCurrentSection(section: 'all' | 'archived') {
    this.currentSection = section;
    this.selectedTag = null;
    this.searchQuery = '';
    this.hasSearchResults = true;
    this.onSearch();
  }

  filterByTag(tag: string) {
    if (this.selectedTag === tag) {
      this.selectedTag = null;
      this.onSearch();
    } else {
      this.selectedTag = tag;
      this.filteredNotes = this.noteService
        .getNotes()
        .filter((note) => note.tags.includes(tag));
      this.hasSearchResults = this.filteredNotes.length > 0;
    }
  }

  getVisibleNotes(): Note[] {
    if (this.selectedTag) {
      return this.filteredNotes;
    }
    return this.searchQuery
      ? this.filteredNotes
      : this.currentSection === 'all'
      ? this.noteService.getNotes()
      : this.noteService.getArchivedNotes();
  }

  getAllTags(): string[] {
    return this.noteService.getAllTags();
  }

  getPageTitle(): string {
    if (this.searchQuery.trim()) {
      return `Showing results for: ${this.searchQuery}`;
    }
    if (this.selectedTag) {
      return `Notes tagged with "${this.selectedTag}"`;
    }
    return this.currentSection === 'all' ? 'All Notes' : 'Archived Notes';
  }

  shouldShowNoResults(): boolean | string {
    return this.searchQuery.trim() && !this.hasSearchResults;
  }

  clearSearch() {
    this.searchQuery = '';
    this.selectedTag = null;
    this.hasSearchResults = true;
    this.onSearch();
  }

  formatDate(date: Date): string {
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 3600 * 24));
    if (diffDays === 1) return 'Today';
    if (diffDays === 2) return 'Yesterday';
    if (diffDays <= 7) return `${diffDays} days ago`;
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  }
}
