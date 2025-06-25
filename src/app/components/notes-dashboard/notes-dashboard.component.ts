import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NoteService } from '../../services/note.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Note } from '../../models/note.interface';

@Component({
  selector: 'app-notes-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './notes-dashboard.component.html',
  styleUrls: ['./notes-dashboard.component.scss'],
})
export class NotesDashboardComponent implements OnInit {
  selectedNote: Note | null = null;
  originalNote: Note | null = null;
  isEditing = false;
  editableNote: Partial<Note> = {};

  constructor(
    public noteService: NoteService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    // Subscribe to route parameters to get the selected note ID
    this.route.params.subscribe((params) => {
      if (params['id']) {
        this.selectedNote = this.noteService.getNoteById(params['id']) || null;
        if (this.selectedNote) {
          this.originalNote = { ...this.selectedNote };
          this.resetEditableNote();
        }
      } else {
        // If no specific note ID, show the first note
        const notes = this.noteService.getNotes();
        if (notes.length > 0) {
          this.selectedNote = notes[0];
          this.originalNote = { ...this.selectedNote };
          this.resetEditableNote();
          this.router.navigate(['/notes', notes[0].id], { replaceUrl: true });
        }
      }
    });
  }

  private resetEditableNote() {
    if (this.selectedNote) {
      this.editableNote = {
        title: this.selectedNote.title,
        content: this.selectedNote.content,
        tags: [...this.selectedNote.tags],
      };
    }
  }

  startEditing() {
    this.isEditing = true;
  }

  saveNote() {
    if (!this.editableNote.title?.trim()) {
      alert('Please enter a title for your note.');
      return;
    }
    if (
      this.selectedNote &&
      this.editableNote.title &&
      this.editableNote.content
    ) {
      const updatedNote: Note = {
        ...this.selectedNote,
        title: this.editableNote.title,
        content: this.editableNote.content,
        tags: this.editableNote.tags || [],
        lastEdited: new Date(),
      };

      this.noteService.updateNote(updatedNote);
      this.selectedNote = updatedNote;
      this.originalNote = { ...updatedNote };
      this.isEditing = false;
    }
  }

  cancelEdit() {
    if (this.originalNote) {
      this.selectedNote = { ...this.originalNote };
      this.resetEditableNote();
      this.isEditing = false;
    }
  }

  archiveNote(id: string) {
    this.noteService.archiveNote(id, true);
    // Navigate to next available note or empty state
    const notes = this.noteService.getNotes();
    if (notes.length > 0) {
      this.router.navigate(['/notes', notes[0].id]);
    } else {
      this.router.navigate(['/notes']);
      this.selectedNote = null;
    }
  }

  deleteNote(id: string) {
    if (confirm('Are you sure you want to delete this note?')) {
      this.noteService.deleteNote(id);
      // Navigate to next available note or empty state
      const notes = this.noteService.getNotes();
      if (notes.length > 0) {
        this.router.navigate(['/notes', notes[0].id]);
      } else {
        this.router.navigate(['/notes']);
        this.selectedNote = null;
      }
    }
  }

  // Tag management methods
  addTag(tagInput: HTMLInputElement) {
    const tagValue = tagInput.value.trim();
    if (
      tagValue &&
      this.editableNote.tags &&
      !this.editableNote.tags.includes(tagValue)
    ) {
      this.editableNote.tags.push(tagValue);
      tagInput.value = '';
    }
  }

  removeTag(tagToRemove: string) {
    if (this.editableNote.tags) {
      this.editableNote.tags = this.editableNote.tags.filter(
        (tag) => tag !== tagToRemove
      );
    }
  }

  onTagKeyPress(event: KeyboardEvent, tagInput: HTMLInputElement) {
    if (event.key === 'Enter') {
      event.preventDefault();
      this.addTag(tagInput);
    }
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

  // Check if note has been modified
  hasUnsavedChanges(): boolean {
    if (!this.selectedNote || !this.isEditing) return false;

    return (
      this.editableNote.title !== this.selectedNote.title ||
      this.editableNote.content !== this.selectedNote.content ||
      JSON.stringify(this.editableNote.tags) !==
        JSON.stringify(this.selectedNote.tags)
    );
  }
}
