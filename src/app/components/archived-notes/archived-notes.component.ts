import { Component, OnInit } from '@angular/core';
import { NoteService } from '../../services/note.service';
import { CommonModule } from '@angular/common';
import { Note } from '../../models/note.interface';

@Component({
  selector: 'app-archived-notes',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './archived-notes.component.html',
  styleUrls: ['./archived-notes.component.scss'],
})
export class ArchivedNotesComponent implements OnInit {
  archivedNotes: Note[] = [];
  selectedNote: Note | null = null;

  constructor(public noteService: NoteService) {}

  ngOnInit() {
    this.loadArchivedNotes();
  }

  loadArchivedNotes() {
    this.archivedNotes = this.noteService.getArchivedNotes();
    // If we had a selected note and it's no longer archived, clear selection
    if (
      this.selectedNote &&
      !this.archivedNotes.find((note) => note.id === this.selectedNote!.id)
    ) {
      this.selectedNote = null;
    }
  }

  selectNote(note: Note) {
    this.selectedNote = note;
  }

  restoreNote(id: string) {
    if (confirm('Are you sure you want to restore this note?')) {
      this.noteService.archiveNote(id, false);
      this.loadArchivedNotes();
      // Clear selection if the restored note was selected
      if (this.selectedNote?.id === id) {
        this.selectedNote = null;
      }
    }
  }

  deleteNote(id: string) {
    if (
      confirm(
        'Are you sure you want to permanently delete this note? This action cannot be undone.'
      )
    ) {
      this.noteService.deleteNote(id);
      this.loadArchivedNotes();
      // Clear selection if the deleted note was selected
      if (this.selectedNote?.id === id) {
        this.selectedNote = null;
      }
    }
  }

  closeDetails() {
    this.selectedNote = null;
  }

  formatDate(date: Date): string {
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;

    return date.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  }
}
