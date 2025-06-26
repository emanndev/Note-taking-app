import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { NoteService } from '../../services/note.service';
import { Note } from '../../models/note.interface';
@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent {
  @Input() isCollapsed = false;
  @Input() selectedNoteId: string | null = null;
  @Input() currentSection: 'all' | 'archived' = 'all';
  @Input() selectedTag: string | null = null;
  @Input() isMobileHidden = false;
  @Input() showMobileClose = false;

  @Output() sectionChange = new EventEmitter<'all' | 'archived'>();
  @Output() noteSelect = new EventEmitter<string>();
  @Output() tagFilter = new EventEmitter<string | null>();
  @Output() createNote = new EventEmitter<void>();
  @Output() closeMobileSidebar = new EventEmitter<void>();

  constructor(public noteService: NoteService, private router: Router) {}

  ngOnInit() {}

  setCurrentSection(section: 'all' | 'archived') {
    this.currentSection = section;
    this.selectedTag = null;
    this.sectionChange.emit(section);
  }

  selectNote(noteId: string) {
    this.selectedNoteId = noteId;
    this.noteSelect.emit(noteId);
    if (this.showMobileClose) {
      this.closeSidebar();
    }
  }

  filterByTag(tag: string) {
    if (this.selectedTag === tag) {
      this.selectedTag = null;
      this.tagFilter.emit(null);
    } else {
      this.selectedTag = tag;
      this.tagFilter.emit(tag);
    }
  }

  createNewNote() {
    this.createNote.emit();
    if (this.showMobileClose) {
      this.closeSidebar();
    }
  }

  closeSidebar() {
    this.closeMobileSidebar.emit();
  }

  getVisibleNotes(): Note[] {
    return this.currentSection === 'all'
      ? this.noteService.getNotes()
      : this.noteService.getArchivedNotes();
  }

  getAllTags(): string[] {
    return this.noteService.getAllTags();
  }

  formatDate(date: Date): string {
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;

    return date.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  }
}
