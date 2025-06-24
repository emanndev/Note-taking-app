import { Component } from '@angular/core';
import { NoteService } from '../../services/note.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-note-create',
  imports: [],
  templateUrl: './note-create.component.html',
  styleUrl: './note-create.component.scss',
})
export class NoteCreateComponent {
  note = {
    id: '',
    title: '',
    content: '',
    tags: [],
    isArchived: false,
    createdAt: new Date('2025-06-24T12:54:00Z'),
  };

  constructor(private noteService: NoteService, private router: Router) {}

  onSubmit(form: NgForm) {
    if (form.valid) {
      this.noteService.createNote(this.note);
      this.router.navigate(['/notes']);
    }
  }
}
