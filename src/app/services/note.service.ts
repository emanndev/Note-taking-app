import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Note } from '../models/note.interface';
import { v4 as uuidv4 } from 'uuid';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class NoteService {
  private notes: Note[] = [];
  private readonly STORAGE_KEY = 'notes';
  private readonly notesData = 'assets/data/sample-notes.json';

  constructor(private http: HttpClient) {
    this.loadNotes();
  }

  private saveNotes() {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.notes));
  }

  private loadNotes() {
    const storedNotes = localStorage.getItem(this.STORAGE_KEY);
    if (storedNotes) {
      this.notes = JSON.parse(storedNotes);
      this.notes = this.notes.map((note) => ({
        ...note,
        createdAt: new Date(note.createdAt),
        lastEdited: new Date(note.lastEdited),
      }));
    } else {
      this.http.get<Partial<Note>[]>(this.notesData).subscribe({
        next: (sampleNotes) => {
          sampleNotes.forEach((noteData) => {
            const note: Note = {
              id: '',
              title: noteData.title!,
              content: noteData.content!,
              tags: noteData.tags || [],
              createdAt: new Date(),
              lastEdited: new Date(),
              isArchived: noteData.isArchived || false,
            };
            this.createNote(note);
          });
        },
        error: (error) => {
          console.error('Failed to load sample notes:', error);
        },
      });
    }
  }

  createNote(note: Note) {
    note.id = uuidv4();
    note.createdAt = new Date();
    note.lastEdited = new Date();
    note.tags = note.tags || [];
    this.notes.push(note);
    this.saveNotes();
    return note;
  }

  getNotes(): Note[] {
    return this.notes.filter((note) => !note.isArchived);
  }

  getArchivedNotes(): Note[] {
    return this.notes.filter((note) => note.isArchived);
  }

  getNoteById(id: string): Note | undefined {
    return this.notes.find((note) => note.id === id);
  }

  updateNote(updatedNote: Note) {
    const index = this.notes.findIndex((note) => note.id === updatedNote.id);
    if (index !== -1) {
      updatedNote.lastEdited = new Date();
      this.notes[index] = updatedNote;
      this.saveNotes();
    }
  }

  archiveNote(id: string, archive: boolean) {
    const note = this.getNoteById(id);
    if (note) {
      note.isArchived = archive;
      note.lastEdited = new Date();
      this.saveNotes();
    }
  }

  filterNotes(query: string, includeArchived: boolean = false): Note[] {
    const lowercaseQuery = query.toLowerCase();
    return this.notes.filter(
      (note) =>
        (includeArchived || !note.isArchived) &&
        (note.title.toLowerCase().includes(lowercaseQuery) ||
          note.content.toLowerCase().includes(lowercaseQuery) ||
          note.tags.some((tag) => tag.toLowerCase().includes(lowercaseQuery)))
    );
  }

  getAllTags(): string[] {
    const tags = new Set<string>();
    this.notes.forEach((note) => {
      if (!note.isArchived) {
        note.tags.forEach((tag) => tags.add(tag));
      }
    });
    return Array.from(tags).sort();
  }

  deleteNote(id: string): void {
    const noteIndex = this.notes.findIndex((note) => note.id === id);
    if (noteIndex !== -1) {
      this.notes.splice(noteIndex, 1);
      this.saveNotes();
    }
  }
}
