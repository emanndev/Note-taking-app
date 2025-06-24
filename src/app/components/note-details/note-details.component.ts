import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NoteService } from '../../services/note.service';
import { FormsModule } from '@angular/forms';
import { NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-note-details',
  standalone: true,
  imports: [FormsModule, CommonModule],
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
    createdAt: new Date('2025-06-24T13:20:00Z'),
  };

  constructor(
    private route: ActivatedRoute,
    private noteService: NoteService,
    private router: Router
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      const foundNote = this.noteService.getNoteById(id);
      if (foundNote) this.note = { ...foundNote };
    }
  }

  onSave(form: NgForm) {
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
