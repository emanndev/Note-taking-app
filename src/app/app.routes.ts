import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'notes',
    loadComponent: () =>
      import('./components/notes-dashboard/notes-dashboard.component'),
  },
  {
    path: 'archived',
    loadComponent: () =>
      import('./components/archived-notes/archived-notes.component'),
  },
  {
    path: 'notes/:id',
    loadComponent: () =>
      import('./components/note-details/note-details.component'),
  },
  {
    path: 'create',
    loadComponent: () =>
      import('./components/note-create/note-create.component'),
  },
  {
    path: 'settings',
    loadComponent: () => import('./components/settings/settings.component'),
  },
  { path: '', redirectTo: '/notes', pathMatch: 'full' },
];
