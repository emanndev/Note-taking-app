import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NoteService } from '../../services/note.service';
import { Note } from '../../models/note.interface';
import { NoteDetailsComponent } from '../note-details/note-details.component';

@Component({
  selector: 'app-notes-list',
  standalone: true,
  imports: [CommonModule, NoteDetailsComponent],
  templateUrl: './notes-list.component.html',
  styleUrls: ['./notes-list.component.scss'],
})
export class NotesListComponent {
  @Input() selectedNoteId: string | null = null;
  @Input() currentSection: 'all' | 'archived' = 'all';
  @Input() selectedTag: string | null = null;
  @Input() filteredNotes: Note[] = [];

  @Output() noteSelect = new EventEmitter<string>();
  @Output() createNote = new EventEmitter<void>();

  constructor(public noteService: NoteService) {}

  selectNote(noteId: string) {
    this.noteSelect.emit(noteId);
  }

  createNewNote() {
    this.createNote.emit();
  }

  getVisibleNotes(): Note[] {
    // Use filtered notes if available, otherwise get from service
    if (this.filteredNotes && this.filteredNotes.length > 0) {
      return this.filteredNotes;
    }

    if (this.selectedTag) {
      return this.noteService
        .getNotes()
        .filter((note) => note.tags.includes(this.selectedTag!));
    }

    return this.currentSection === 'all'
      ? this.noteService.getNotes()
      : this.noteService.getArchivedNotes();
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
