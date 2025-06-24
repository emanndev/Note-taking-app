import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NoteService } from '../../services/note.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-note-details',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './note-details.component.html',
  styleUrls: ['./note-details.component.scss'],
})
export class NoteDetailsComponent implements OnInit {
  note: any = {
    id: '',
    title: '',
    content: '',
    tags: [],
    isArchived: false,
    createdAt: new Date(),
  };

  constructor(
    private route: ActivatedRoute,
    private noteService: NoteService,
    private router: Router
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.note = this.noteService.getNoteById(id) || this.note;
    }
  }

  onSave(form: any) {
    if (form.valid) {
      this.noteService.updateNote(this.note);
      this.router.navigate(['/notes']);
    }
  }

  onDelete() {
    if (confirm('Are you sure you want to delete this note?')) {
      this.noteService.deleteNote(this.note.id);
      this.router.navigate(['/notes']);
    }
  }
}
