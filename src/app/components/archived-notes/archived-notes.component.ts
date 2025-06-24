import { Component, OnInit } from '@angular/core';
import { NoteService } from '../../services/note.service';

@Component({
  selector: 'app-archived-notes',
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
