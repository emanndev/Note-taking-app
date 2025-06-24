import { Injectable } from '@angular/core';
import { Note } from '../models/note.interface';

@Injectable({
  providedIn: 'root',
})
export class NoteService {
  private notes: Note[] = [];

  createNote(note: Note) {
    note.id = Date.now().toString();
    note.createdAt = new Date();
    this.notes.push(note);
    return note;
  }

  getNotes() {
    return this.notes.filter((note) => !note.isArchived);
  }

  getArchivedNotes() {
    return this.notes.filter((note) => note.isArchived);
  }

  getNoteById(id: string) {
    return this.notes.find((note) => note.id === id);
  }

  updateNote(updatedNote: Note) {
    const index = this.notes.findIndex((note) => note.id === updatedNote.id);
    if (index !== -1) this.notes[index] = updatedNote;
  }

  deleteNote(id: string) {
    this.notes = this.notes.filter((note) => note.id !== id);
  }

  archiveNote(id: string, archive: boolean) {
    const note = this.getNoteById(id);
    if (note) note.isArchived = archive;
  }

  filterNotes(query: string) {
    return this.notes.filter(
      (note) =>
        note.title.toLowerCase().includes(query.toLowerCase()) ||
        note.content.toLowerCase().includes(query.toLowerCase()) ||
        note.tags.some((tag) => tag.toLowerCase().includes(query.toLowerCase()))
    );
  }
}
