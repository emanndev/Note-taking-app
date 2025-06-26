import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Note } from '../models/note.interface';
import { v4 as uuidv4 } from 'uuid';
import { Observable, BehaviorSubject } from 'rxjs';
import { map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class NoteService {
  private notes: Note[] = [];
  private readonly STORAGE_KEY = 'notes-app-data';
  private readonly notesData = 'assets/data/sample-notes.json';
  private notesSubject = new BehaviorSubject<Note[]>([]);
  public notes$ = this.notesSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadNotes();
  }

  private saveNotes() {
    try {
      const notesData = JSON.stringify(this.notes);
      // Store in memory for demo purposes (since localStorage isn't available in artifacts)
      // In a real app, you would use: localStorage.setItem(this.STORAGE_KEY, notesData);
      console.log('Notes saved to storage:', this.notes.length, 'notes');
      this.notesSubject.next([...this.notes]);
    } catch (error) {
      console.error('Failed to save notes:', error);
    }
  }

  private loadNotes() {
    try {
      // In a real app, you would use: localStorage.getItem(this.STORAGE_KEY)
      // For demo purposes, we'll initialize with empty array and load sample data
      const storedNotes = null; // localStorage.getItem(this.STORAGE_KEY);

      if (storedNotes) {
        this.notes = JSON.parse(storedNotes);
        this.notes = this.notes.map((note) => ({
          ...note,
          createdAt: new Date(note.createdAt),
          lastEdited: new Date(note.lastEdited),
        }));
        this.notesSubject.next([...this.notes]);
        console.log('Loaded notes from storage:', this.notes.length, 'notes');
      } else {
        // Load sample data if no stored notes
        this.loadSampleNotes();
      }
    } catch (error) {
      console.error('Failed to load notes from storage:', error);
      this.loadSampleNotes();
    }
  }

  private loadSampleNotes() {
    // Load sample notes if HTTP service is available
    if (this.http) {
      this.http.get<Partial<Note>[]>(this.notesData).subscribe({
        next: (sampleNotes) => {
          sampleNotes.forEach((noteData) => {
            const note: Note = {
              id: '',
              title: noteData.title || 'Untitled Note',
              content: noteData.content || '',
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
          // Create a default note if sample loading fails
          this.createDefaultNote();
        },
      });
    } else {
      this.createDefaultNote();
    }
  }

  private createDefaultNote() {
    const defaultNote: Note = {
      id: '',
      title: 'Welcome to Notes',
      content: `Welcome to your notes app!

This is your first note. You can:
- Edit this note by clicking on the title or content
- Add tags by typing in the tags field
- Create new notes using the sidebar
- Archive or delete notes using the action buttons

Start organizing your thoughts and ideas!`,
      tags: ['Welcome', 'Getting Started'],
      createdAt: new Date(),
      lastEdited: new Date(),
      isArchived: false,
    };
    this.createNote(defaultNote);
  }

  createNote(note: Partial<Note>): Note {
    const newNote: Note = {
      id: uuidv4(),
      title: note.title || 'Untitled Note',
      content: note.content || '',
      tags: note.tags || [],
      createdAt: new Date(),
      lastEdited: new Date(),
      isArchived: note.isArchived || false,
    };

    this.notes.unshift(newNote); // Add to beginning of array
    this.saveNotes();
    console.log('Created new note:', newNote.title);
    return newNote;
  }

  getNotes(): Note[] {
    return this.notes.filter((note) => !note.isArchived);
  }

  getArchivedNotes(): Note[] {
    return this.notes.filter((note) => note.isArchived);
  }

  getAllNotes(): Note[] {
    return [...this.notes];
  }

  getNoteById(id: string): Note | undefined {
    return this.notes.find((note) => note.id === id);
  }

  updateNote(updatedNote: Note): void {
    const index = this.notes.findIndex((note) => note.id === updatedNote.id);
    if (index !== -1) {
      // Update the last edited time
      updatedNote.lastEdited = new Date();
      this.notes[index] = { ...updatedNote };
      this.saveNotes();
      console.log('Updated note:', updatedNote.title);
    } else {
      console.error('Note not found for update:', updatedNote.id);
    }
  }

  archiveNote(id: string, archive: boolean = true): void {
    const note = this.getNoteById(id);
    if (note) {
      note.isArchived = archive;
      note.lastEdited = new Date();
      this.saveNotes();
      console.log(`${archive ? 'Archived' : 'Unarchived'} note:`, note.title);
    } else {
      console.error('Note not found for archiving:', id);
    }
  }

  deleteNote(id: string): void {
    const noteIndex = this.notes.findIndex((note) => note.id === id);
    if (noteIndex !== -1) {
      const deletedNote = this.notes[noteIndex];
      this.notes.splice(noteIndex, 1);
      this.saveNotes();
      console.log('Deleted note:', deletedNote.title);
    } else {
      console.error('Note not found for deletion:', id);
    }
  }

  filterNotes(query: string, includeArchived: boolean = false): Note[] {
    if (!query.trim()) {
      return includeArchived ? this.getAllNotes() : this.getNotes();
    }

    const lowercaseQuery = query.toLowerCase();
    return this.notes.filter(
      (note) =>
        (includeArchived || !note.isArchived) &&
        (note.title.toLowerCase().includes(lowercaseQuery) ||
          note.content.toLowerCase().includes(lowercaseQuery) ||
          note.tags.some((tag) => tag.toLowerCase().includes(lowercaseQuery)))
    );
  }

  searchNotes(query: string): Note[] {
    return this.filterNotes(query, false);
  }

  getNotesWithTag(tag: string): Note[] {
    return this.notes.filter(
      (note) => !note.isArchived && note.tags.includes(tag)
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

  getRecentNotes(limit: number = 5): Note[] {
    return this.getNotes()
      .sort((a, b) => b.lastEdited.getTime() - a.lastEdited.getTime())
      .slice(0, limit);
  }

  duplicateNote(id: string): Note | null {
    const originalNote = this.getNoteById(id);
    if (originalNote) {
      const duplicatedNote: Partial<Note> = {
        title: `${originalNote.title} (Copy)`,
        content: originalNote.content,
        tags: [...originalNote.tags],
        isArchived: false,
      };
      return this.createNote(duplicatedNote);
    }
    return null;
  }

  exportNotes(): string {
    return JSON.stringify(this.notes, null, 2);
  }

  importNotes(notesData: string): boolean {
    try {
      const importedNotes = JSON.parse(notesData) as Note[];
      if (Array.isArray(importedNotes)) {
        // Validate and process imported notes
        const validNotes = importedNotes.filter(
          (note) => note.title !== undefined && note.content !== undefined
        );

        validNotes.forEach((note) => {
          note.id = uuidv4(); // Generate new IDs to avoid conflicts
          note.createdAt = new Date(note.createdAt);
          note.lastEdited = new Date(note.lastEdited);
        });

        this.notes.push(...validNotes);
        this.saveNotes();
        console.log('Imported notes:', validNotes.length);
        return true;
      }
    } catch (error) {
      console.error('Failed to import notes:', error);
    }
    return false;
  }

  getNotesCount(): { total: number; active: number; archived: number } {
    const active = this.getNotes().length;
    const archived = this.getArchivedNotes().length;
    return {
      total: active + archived,
      active,
      archived,
    };
  }
}
