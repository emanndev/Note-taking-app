import { Routes } from '@angular/router';
import { NotesDashboardComponent } from './components/notes-dashboard/notes-dashboard.component';
import { ArchivedNotesComponent } from './components/archived-notes/archived-notes.component';
import { NoteDetailsComponent } from './components/note-details/note-details.component';
import { NoteCreateComponent } from './components/note-create/note-create.component';
import { SettingsComponent } from './components/settings/settings.component';

export const routes: Routes = [
  {
    path: 'notes',
    component: NotesDashboardComponent,
  },
  {
    path: 'archived',
    component: ArchivedNotesComponent,
  },
  {
    path: 'notes/:id',
    component: NoteDetailsComponent,
  },
  {
    path: 'create',
    component: NoteCreateComponent,
  },
  {
    path: 'settings',
    component: SettingsComponent,
  },
  { path: '', redirectTo: '/notes', pathMatch: 'full' },
];
