import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { NoteService } from '../../services/note.service';

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
  @Output() tagFilter = new EventEmitter<string | null>();
  @Output() closeMobileSidebar = new EventEmitter<void>();

  constructor(public noteService: NoteService, private router: Router) {}

  ngOnInit() {}

  setCurrentSection(section: 'all' | 'archived') {
    this.currentSection = section;
    this.selectedTag = null;
    this.sectionChange.emit(section);
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

  closeSidebar() {
    this.closeMobileSidebar.emit();
  }

  getAllTags(): string[] {
    return this.noteService.getAllTags();
  }
}
