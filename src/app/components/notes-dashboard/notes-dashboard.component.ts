import { Component, OnInit } from '@angular/core';
import { NoteService } from '../../services/note.service';
import { Pipe } from '@angular/core';

@Component({
  selector: 'app-notes-dashboard',
  standalone: true,
  imports: [],
  templateUrl: './notes-dashboard.component.html',
  styleUrls: ['./notes-dashboard.component.scss'],
})
export class NotesDashboardComponent implements OnInit {
  filteredNotes: any[] = [];

  constructor(public noteService: NoteService) {}

  ngOnInit() {
    this.filteredNotes = this.noteService.getNotes();
  }

  archiveNote(id: string) {
    this.noteService.archiveNote(id, true);
    this.filteredNotes = this.noteService.getNotes();
  }
}
