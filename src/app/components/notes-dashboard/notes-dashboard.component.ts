// notes-dashboard.component.ts
import { Component, OnInit, Input, HostListener } from '@angular/core';
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
  @Input() selectedNoteId: string | null = null;
  @Input() currentSection: 'all' | 'archived' = 'all';
  @Input() selectedTag: string | null = null;
  @Input() filteredNotes: Note[] = [];

  selectedNote: Note | null = null;
  originalNote: Note | null = null;
  tagInput = '';
  isMobile = false;

  constructor(
    public noteService: NoteService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.checkScreenSize();
    this.loadNotes();

    // Subscribe to route parameters
    this.route.params.subscribe((params) => {
      if (params['id']) {
        this.selectedNoteId = params['id'];
        this.loadSelectedNote();
      } else {
        // If no ID in route, but we have notes, select the first one
        const notes = this.getVisibleNotes();
        if (notes.length > 0) {
          this.selectedNoteId = notes[0].id;
          this.loadSelectedNote();
          // Update the URL to reflect the selected note
          this.router.navigate(['/dashboard/notes', notes[0].id], {
            replaceUrl: true,
          });
        } else {
          this.selectedNoteId = null;
          this.selectedNote = null;
          this.originalNote = null;
        }
      }
    });

    // Subscribe to notes changes to handle newly created notes
    this.noteService.notesChanged.subscribe(() => {
      // If we don't have a selected note, try to select the first available note
      if (!this.selectedNote) {
        const notes = this.getVisibleNotes();
        if (notes.length > 0) {
          this.selectedNoteId = notes[0].id;
          this.loadSelectedNote();
          this.router.navigate(['/dashboard/notes', notes[0].id], {
            replaceUrl: true,
          });
        }
      }
    });
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.checkScreenSize();
  }

  private checkScreenSize() {
    this.isMobile = window.innerWidth < 768;
  }

  private loadNotes() {
    // This method can be expanded if you need to load notes from a service
  }

  private loadSelectedNote() {
    if (this.selectedNoteId) {
      const note = this.noteService.getNoteById(this.selectedNoteId);
      if (note) {
        this.selectedNote = { ...note };
        this.originalNote = { ...note };
      } else {
        // Note not found, redirect to notes list
        this.router.navigate(['/dashboard/notes']);
        this.selectedNote = null;
        this.originalNote = null;
      }
    }
  }

  getVisibleNotes(): Note[] {
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

  selectNote(noteId: string) {
    this.selectedNoteId = noteId;
    this.loadSelectedNote();
    this.router.navigate(['/dashboard/notes', noteId]);
  }

  createNewNote() {
    this.router.navigate(['/dashboard/create']);
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
    if (confirm('Are you sure you want to archive this note?')) {
      this.noteService.archiveNote(id, true);
      // Navigate to the next available note or notes list
      const notes = this.noteService.getNotes();
      if (notes.length > 0) {
        this.router.navigate(['/dashboard/notes', notes[0].id]);
      } else {
        this.router.navigate(['/dashboard/notes']);
      }
    }
  }

  deleteNote(id: string) {
    if (
      confirm(
        'Are you sure you want to delete this note? This action cannot be undone.'
      )
    ) {
      this.noteService.deleteNote(id);
      // Navigate to the next available note or notes list
      const notes = this.noteService.getNotes();
      if (notes.length > 0) {
        this.router.navigate(['/dashboard/notes', notes[0].id]);
      } else {
        this.router.navigate(['/dashboard/notes']);
      }
    }
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


