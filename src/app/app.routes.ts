import { Routes } from '@angular/router';
import { NotesDashboardComponent } from './components/notes-dashboard/notes-dashboard.component';
import { ArchivedNotesComponent } from './components/archived-notes/archived-notes.component';
import { NoteDetailsComponent } from './components/note-details/note-details.component';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { SettingsComponent } from './components/settings/settings.component';

export const routes: Routes = [
  { path: '', redirectTo: '/notes', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'notes', component: NotesDashboardComponent },
  { path: 'notes/:id', component: NotesDashboardComponent },
  { path: 'archived', component: NotesDashboardComponent },
  { path: 'create', component: NotesDashboardComponent },
  { path: 'settings', component: NotesDashboardComponent },
  { path: '**', redirectTo: '/notes' },
];
