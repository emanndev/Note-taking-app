import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NoteService } from '../../services/note.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Note } from '../../models/note.interface';

@Component({
  selector: 'app-note-details',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './note-details.component.html',
  styleUrls: ['./note-details.component.scss'],
})
export class NoteDetailsComponent implements OnInit {
  selectedNote: Note | null = null;
  originalNote: Note | null = null;
  tagInput = '';

  constructor(
    public noteService: NoteService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    // Subscribe to route parameters to get the selected note ID
    this.route.params.subscribe((params) => {
      if (params['id']) {
        const note = this.noteService.getNoteById(params['id']);
        if (note) {
          this.selectedNote = { ...note };
          this.originalNote = { ...note };
        } else {
          this.router.navigate(['/dashboard/notes']);
        }
      } else {
        // If no specific note ID, show the first note
        const notes = this.noteService.getNotes();
        if (notes.length > 0) {
          this.selectedNote = { ...notes[0] };
          this.originalNote = { ...notes[0] };
          this.router.navigate(['/dashboard/notes', notes[0].id], {
            replaceUrl: true,
          });
        } else {
          this.selectedNote = null;
          this.originalNote = null;
        }
      }
    });
  }

  updateNote() {
    if (this.selectedNote) {
      this.noteService.updateNote(this.selectedNote);
      this.originalNote = { ...this.selectedNote };
    }
  }

  saveNote() {
    if (this.selectedNote) {
      this.noteService.updateNote(this.selectedNote);
      this.originalNote = { ...this.selectedNote };
      console.log('Note saved successfully');
    }
  }

  cancelChanges() {
    if (this.originalNote) {
      this.selectedNote = { ...this.originalNote };
    }
    this.router.navigate(['/dashboard/notes']);
  }

  addTag() {
    if (this.tagInput.trim() && this.selectedNote) {
      const newTag = this.tagInput.trim();
      if (!this.selectedNote.tags.includes(newTag)) {
        this.selectedNote.tags.push(newTag);
        this.updateNote();
      }
      this.tagInput = '';
    }
  }

  removeTag(tag: string) {
    if (this.selectedNote) {
      this.selectedNote.tags = this.selectedNote.tags.filter((t) => t !== tag);
      this.updateNote();
    }
  }

  trackByTag(index: number, tag: string): string {
    return tag;
  }

  archiveNote(id: string) {
    this.noteService.archiveNote(id, true);
    const notes = this.noteService.getNotes();
    if (notes.length > 0) {
      this.router.navigate(['/dashboard/notes', notes[0].id]);
    } else {
      this.router.navigate(['/dashboard/notes']);
      this.selectedNote = null;
    }
  }

  deleteNote(id: string) {
    if (confirm('Are you sure you want to delete this note?')) {
      this.noteService.deleteNote(id);
      const notes = this.noteService.getNotes();
      if (notes.length > 0) {
        this.router.navigate(['/dashboard/notes', notes[0].id]);
      } else {
        this.router.navigate(['/dashboard/notes']);
        this.selectedNote = null;
      }
    }
  }

  createNewNote() {
    this.router.navigate(['/dashboard/create']);
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
