import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NoteService } from '../../services/note.service';
import { CommonModule } from '@angular/common';
import { Note } from '../../models/note.interface';

@Component({
  selector: 'app-notes-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notes-dashboard.component.html',
  styleUrls: ['./notes-dashboard.component.scss'],
})
export class NotesDashboardComponent implements OnInit {
  selectedNote: Note | null = null;

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
      } else {
        // If no specific note ID, show the first note
        const notes = this.noteService.getNotes();
        if (notes.length > 0) {
          this.selectedNote = notes[0];
          this.router.navigate(['/notes', notes[0].id], { replaceUrl: true });
        }
      }
    });
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
