import { Component } from '@angular/core';
import { NoteService } from '../../services/note.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Note } from '../../models/note.interface';
import { v4 as uuidv4 } from 'uuid';

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
    tags: [] as string[],
    isArchived: false,
    createdAt: new Date(),
    lastEdited: new Date(),
  };

  constructor(private noteService: NoteService, private router: Router) {}

  addTagsFromInput(tagsString: string) {
    if (!tagsString.trim()) return;

    const tagsArray = tagsString
      .split(',')
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0 && !this.note.tags.includes(tag));

    this.note.tags = [...this.note.tags, ...tagsArray];
  }

  removeTag(index: number) {
    this.note.tags.splice(index, 1);
  }

  onContentChange() {
    this.note.lastEdited = new Date();
  }

  getLastEditedText(): string {
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - this.note.lastEdited.getTime());
    const diffMinutes = Math.floor(diffTime / (1000 * 60));

    if (diffMinutes < 1) return 'Not yet saved';
    if (diffMinutes < 60) return `${diffMinutes} minutes ago`;

    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) return `${diffHours} hours ago`;

    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays} days ago`;
  }

  saveNote() {
    if (!this.note.title.trim()) {
      alert('Please enter a title for your note.');
      return;
    }

    const noteToSave: Note = {
      id: '',
      title: this.note.title,
      content: this.note.content,
      tags: this.note.tags,
      createdAt: this.note.createdAt,
      lastEdited: new Date(),
      isArchived: false,
    };

    const savedNote = this.noteService.createNote(noteToSave);

    // Navigate to the newly created note
    this.router.navigate(['/dashboard/notes', savedNote.id]);
  }

  cancelCreation() {
    if (this.note.title.trim() || this.note.content.trim()) {
      if (
        confirm('Are you sure you want to cancel? Your changes will be lost.')
      ) {
        this.router.navigate(['/dashboard/notes']);
      }
    } else {
      this.router.navigate(['/dashboard/notes']);
    }
  }
}
