import { Component, OnInit, Input, HostListener } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NoteService } from '../../services/note.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { NotesListComponent } from '../notes-list/notes-list.component';
import { Note } from '../../models/note.interface';

@Component({
  selector: 'app-notes-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterOutlet, NotesListComponent],
  templateUrl: './notes-dashboard.component.html',
  styleUrls: ['./notes-dashboard.component.scss'],
})
export class NotesDashboardComponent implements OnInit {
  @Input() selectedNoteId: string | null = null;
  @Input() currentSection: 'all' | 'archived' = 'all';
  @Input() selectedTag: string | null = null;
  @Input() filteredNotes: Note[] = [];

  isMobile = false;

  constructor(
    public noteService: NoteService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.checkScreenSize();

    this.route.params.subscribe((params) => {
      this.selectedNoteId = params['id'] || null;

      if (!this.selectedNoteId && !this.isMobile) {
        const notes = this.noteService.getNotes();
        if (notes.length > 0) {
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

  selectNote(noteId: string) {
    this.selectedNoteId = noteId;
    this.router.navigate(['/dashboard/notes', noteId]);
  }

  createNewNote() {
    this.router.navigate(['/dashboard/create']);
  }

  goBack() {
    this.selectedNoteId = null;
    this.router.navigate(['/dashboard/notes']);
  }
}
