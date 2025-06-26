import { Component, OnInit, HostListener } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NoteService } from '../../services/note.service';
import { ThemeService } from '../../services/theme.service';
import { FormsModule } from '@angular/forms';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { Note } from '../../models/note.interface';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    FormsModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    CommonModule,
    SidebarComponent,
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  isMobile = false;
  sidebarCollapsed = false;
  showMobileSidebar = false;
  searchQuery = '';
  filteredNotes: Note[] = [];
  selectedNoteId: string | null = null;
  currentSection: 'all' | 'archived' = 'all';
  selectedTag: string | null = null;

  constructor(
    public noteService: NoteService,
    public themeService: ThemeService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.checkScreenSize();

    // Subscribe to notes changes from the service
    this.noteService.notes$.subscribe(() => {
      this.onSearch(); // Refresh filtered notes when notes are updated
    });

    // Initial search to populate filtered notes
    this.onSearch();

    // Listen for route changes to update selected note
    this.route.params.subscribe((params) => {
      if (params['id']) {
        this.selectedNoteId = params['id'];
      }
    });
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.checkScreenSize();
  }

  private checkScreenSize() {
    this.isMobile = window.innerWidth < 768;
    if (this.isMobile) {
      this.sidebarCollapsed = false;
      this.showMobileSidebar = false;
    }
  }

  toggleSidebar() {
    if (this.isMobile) {
      this.showMobileSidebar = !this.showMobileSidebar;
    } else {
      this.sidebarCollapsed = !this.sidebarCollapsed;
    }
  }

  closeMobileSidebar() {
    this.showMobileSidebar = false;
  }

  onSearch() {
    if (this.searchQuery.trim()) {
      this.filteredNotes = this.noteService.filterNotes(this.searchQuery);
    } else {
      this.filteredNotes =
        this.currentSection === 'all'
          ? this.noteService.getNotes()
          : this.noteService.getArchivedNotes();
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
    this.onSearch();

    // Navigate to appropriate route
    if (section === 'all') {
      this.router.navigate(['/dashboard/notes']);
    } else {
      this.router.navigate(['/dashboard/archived']);
    }
  }

  filterByTag(tag: string | null) {
    this.selectedTag = tag;
    if (tag) {
      this.filteredNotes = this.noteService
        .getNotes()
        .filter((note) => note.tags.includes(tag));
    } else {
      this.onSearch();
    }
  }

  createNewNote() {
    this.router.navigate(['/dashboard/create']);
  }

  openSettings() {
    this.router.navigate(['/dashboard/settings']);
  }

  getPageTitle(): string {
    if (this.selectedTag) {
      return `Notes tagged with "${this.selectedTag}"`;
    }
    return this.currentSection === 'all' ? 'All Notes' : 'Archived Notes';
  }
}
