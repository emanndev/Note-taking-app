import { Component } from '@angular/core';
import { NoteService } from '../../services/note.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-note-create',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './note-create.component.html',
  styleUrls: ['./note-create.component.scss'],
})
export class NoteCreateComponent {
  note = {
    id: '',
    title: '',
    content: '',
    tags: [],
    isArchived: false,
    createdAt: new Date('2025-06-24T15:05:00Z'),
  };

  constructor(private noteService: NoteService, private router: Router) {}
}
