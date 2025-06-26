import { Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { NotesDashboardComponent } from './components/notes-dashboard/notes-dashboard.component';
import { ArchivedNotesComponent } from './components/archived-notes/archived-notes.component';
import { NoteDetailsComponent } from './components/note-details/note-details.component';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { NoteCreateComponent } from './components/note-create/note-create.component';
import { SettingsComponent } from './components/settings/settings.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';

export const routes: Routes = [
  // Auth routes
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'reset-password', component: ResetPasswordComponent },

  // Dashboard routes
  {
    path: 'dashboard',
    component: DashboardComponent,
    children: [
      { path: '', redirectTo: 'notes', pathMatch: 'full' },
      { path: 'notes', component: NotesDashboardComponent },
      { path: 'notes/:id', component: NoteDetailsComponent },
      { path: 'create', component: NoteCreateComponent },
      { path: 'archived', component: ArchivedNotesComponent },
      { path: 'settings', component: SettingsComponent },
    ],
  },

  // Default redirects
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'notes', redirectTo: '/dashboard/notes', pathMatch: 'full' },
  { path: 'create', redirectTo: '/dashboard/create', pathMatch: 'full' },
  { path: 'archived', redirectTo: '/dashboard/archived', pathMatch: 'full' },
  { path: 'settings', redirectTo: '/dashboard/settings', pathMatch: 'full' },
];
