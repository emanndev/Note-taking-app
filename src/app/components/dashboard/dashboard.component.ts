import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NoteService } from '../../services/note.service';
import { ThemeService } from '../../services/theme.service';
import { FormsModule } from '@angular/forms';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Note } from '../../models/note.interface';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    FormsModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    CommonModule,
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  isMobile = window.innerWidth < 768;
  sidebarCollapsed = false;
  searchQuery = '';
  filteredNotes: Note[] = [];
  selectedNoteId: string | null = null;
  currentSection: 'all' | 'archived' = 'all';
  selectedTag: string | null = null;

  constructor(
    public noteService: NoteService,
    public themeService: ThemeService,
    private router: Router
  ) {}

  ngOnInit() {
    // Initialize with some sample data if no notes exist
    this.initializeSampleData();
    this.onSearch();
  }

  toggleSidebar() {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }

  onSearch() {
    if (this.searchQuery.trim()) {
      this.filteredNotes = this.noteService.filterNotes(this.searchQuery);
    } else {
      this.filteredNotes =
        this.currentSection === 'all'
          ? this.noteService.getNotes()
          : this.noteService.getArchivedNotes();
    }
  }

  selectNote(noteId: string) {
    this.selectedNoteId = noteId;
    this.router.navigate(['/dashboard/notes', noteId]);
  }

  setCurrentSection(section: 'all' | 'archived') {
    this.currentSection = section;
    this.selectedTag = null;
    this.searchQuery = '';
    this.onSearch();
  }

  filterByTag(tag: string) {
    if (this.selectedTag === tag) {
      this.selectedTag = null;
      this.onSearch();
    } else {
      this.selectedTag = tag;
      this.filteredNotes = this.noteService
        .getNotes()
        .filter((note) => note.tags.includes(tag));
    }
  }

  getVisibleNotes(): Note[] {
    if (this.selectedTag) {
      return this.filteredNotes;
    }
    return this.searchQuery
      ? this.filteredNotes
      : this.currentSection === 'all'
      ? this.noteService.getNotes()
      : this.noteService.getArchivedNotes();
  }

  getAllTags(): string[] {
    const allNotes = this.noteService.getNotes();
    const tags = new Set<string>();
    allNotes.forEach((note) => {
      note.tags.forEach((tag) => tags.add(tag));
    });
    return Array.from(tags).sort();
  }

  getPageTitle(): string {
    if (this.selectedTag) {
      return `Notes tagged with "${this.selectedTag}"`;
    }
    return this.currentSection === 'all' ? 'All Notes' : 'Archived Notes';
  }

  formatDate(date: Date): string {
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;

    return date.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  }

  private initializeSampleData() {
    // Add sample notes if none exist
    if (this.noteService.getNotes().length === 0) {
      const sampleNotes: Partial<Note>[] = [
        {
          title: 'React Performance Optimization',
          content:
            'Key performance optimization techniques:\n\n1. Code Splitting\n- Use React.lazy() for route-based splitting\n- Implement dynamic imports for heavy components\n\n2. Memoization\n- useMemo for expensive calculations\n- useCallback for function props\n- React.memo for component optimization\n\n3. Virtual List Implementation\n- Use react-window for long lists\n- Implement infinite scrolling\n\nTODO: Benchmark current application and identify bottlenecks',
          tags: ['Dev', 'React'],
          isArchived: false,
        },
        {
          title: 'Japan Travel Planning',
          content: 'Tokyo itinerary and travel tips for upcoming trip',
          tags: ['Travel', 'Personal'],
          isArchived: false,
        },
        {
          title: 'Favorite Pasta Recipes',
          content: 'Collection of my favorite pasta recipes',
          tags: ['Cooking', 'Recipes'],
          isArchived: false,
        },
        {
          title: 'Weekly Workout Plan',
          content: 'Monday: Upper body\nTuesday: Cardio\nWednesday: Lower body',
          tags: ['Dev', 'React'],
          isArchived: false,
        },
        {
          title: 'Meal Prep Ideas',
          content: 'Healthy meal prep recipes for the week',
          tags: ['Cooking', 'Health', 'Recipes'],
          isArchived: false,
        },
        {
          title: 'Reading List',
          content: 'Books to read this year',
          tags: ['Personal', 'Dev'],
          isArchived: false,
        },
        {
          title: 'Fitness Goals 2025',
          content: 'My fitness objectives for this year',
          tags: ['Fitness', 'Health', 'Personal'],
          isArchived: false,
        },
      ];

      sampleNotes.forEach((noteData) => {
        const note: Note = {
          id: '',
          title: noteData.title!,
          content: noteData.content!,
          tags: noteData.tags!,
          createdAt: new Date(),
          lastEdited: new Date(),
          isArchived: noteData.isArchived!,
        };
        this.noteService.createNote(note);
      });
    }
  }
}
