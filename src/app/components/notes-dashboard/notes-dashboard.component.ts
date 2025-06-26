import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NoteService } from '../../services/note.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-notes-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterOutlet],
  templateUrl: './notes-dashboard.component.html',
  styleUrls: ['./notes-dashboard.component.scss'],
})
export class NotesDashboardComponent implements OnInit {
  constructor(
    public noteService: NoteService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    // Check if we have notes and redirect to first note if none selected
    this.route.params.subscribe((params) => {
      if (!params['id']) {
        const notes = this.noteService.getNotes();
        if (notes.length > 0) {
          this.router.navigate(['/dashboard/notes', notes[0].id], {
            replaceUrl: true,
          });
        }
      }
    });
  }

  createNewNote() {
    this.router.navigate(['/dashboard/create']);
  }
}
