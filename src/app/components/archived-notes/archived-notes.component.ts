import { Component, OnInit } from '@angular/core';
import { NoteService } from '../../services/note.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-archived-notes',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './archived-notes.component.html',
  styleUrls: ['./archived-notes.component.scss'],
})
export class ArchivedNotesComponent implements OnInit {
  archivedNotes: any[] = [];

  constructor(public noteService: NoteService) {}

  ngOnInit() {
    this.archivedNotes = this.noteService.getArchivedNotes();
  }

  unarchiveNote(id: string) {
    this.noteService.archiveNote(id, false);
    this.archivedNotes = this.noteService.getArchivedNotes();
  }
}
