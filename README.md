# 📝 Angular Note Taking App v2

A full-featured, Firebase-backed note-taking web application built with **Angular 19** (standalone components). It supports user authentication, note management with tagging, archiving, dark/light/system themes, and persists notes locally via `localStorage` while exposing the foundation for full Firestore cloud sync.

---

## 🚀 Live Demo

> _Deploy link here (e.g., Firebase Hosting, Netlify, Vercel)_

---

## 📸 Screenshots

> _Add screenshots of Login, Dashboard, Archived Notes, and Settings pages here_

---

## 📦 Tech Stack

| Layer              | Technology                            |
|--------------------|---------------------------------------|
| Framework          | Angular 19 (Standalone Components)    |
| Language           | TypeScript 5.7                        |
| Authentication     | Firebase Auth (Email/Password)        |
| Database (planned) | Cloud Firestore                       |
| Local Persistence  | `localStorage`                        |
| Styling            | SCSS with CSS Custom Properties       |
| ID Generation      | `uuid` v11                            |
| HTTP Client        | Angular `HttpClient`                  |
| Reactive State     | RxJS `BehaviorSubject` / `Subject`    |
| Testing            | Karma + Jasmine                       |

---

## 🗂️ Project Structure

```
src/
├── app/
│   ├── components/
│   │   ├── login/              # Login page (reactive form, Firebase auth)
│   │   ├── signup/             # Sign-up page (reactive form, Firebase auth)
│   │   ├── forgot-password/    # Password reset request page
│   │   ├── reset-password/     # Password reset confirmation page
│   │   ├── dashboard/          # Root layout shell (sidebar + router outlet)
│   │   ├── notes-dashboard/    # Two-panel: note list + note editor
│   │   ├── archived-notes/     # Two-panel: archived list + note viewer
│   │   ├── note-create/        # Full-page new note creation form
│   │   ├── note-details/       # (Stub) standalone note detail view
│   │   ├── settings/           # Theme, font, password, and logout settings
│   │   ├── sidebar/            # Collapsible/mobile navigation sidebar
│   │   ├── notes-list/         # (Stub) reusable notes list component
│   │   └── toast/              # Lightweight toast notification component
│   ├── guards/
│   │   └── auth.guard.ts       # Auth guard (currently commented out, ready to enable)
│   ├── models/
│   │   └── note.interface.ts   # Note data model / TypeScript interface
│   ├── services/
│   │   ├── auth.service.ts     # Firebase Authentication wrapper
│   │   ├── note.service.ts     # Core note CRUD, search, filter, and state
│   │   └── theme.service.ts    # Theme and font preference management
│   ├── shared/
│   │   └── auth.component.scss # Shared styles used by Login & Signup
│   ├── app.component.ts        # Root component (router host)
│   ├── app.config.ts           # App-level providers (Firebase, Router, HTTP)
│   └── app.routes.ts           # Application route definitions
├── environments/
│   └── environment.ts          # Firebase project credentials
├── styles.scss                 # Global CSS tokens (light/dark themes, fonts)
└── main.ts                     # Application bootstrap
public/
├── notes-data.json             # Sample seed data loaded on first launch
└── assets/images/              # SVG icons (logo, home, tag, archive, etc.)
```

---

## 🏛️ Architecture

### 1. Standalone Component Architecture

This app uses Angular 19's **standalone component** pattern — no `NgModule` is required. Every component declares its own `imports` array, keeping dependencies explicit and enabling tree-shaking.

### 2. Application Providers (`app.config.ts`)

All global services are bootstrapped through `appConfig`:

```
provideRouter(routes)          → Angular Router
provideHttpClient()            → HttpClient for loading sample notes JSON
provideFirebaseApp(...)        → Firebase SDK initialization
provideAuth(getAuth)           → Firebase Authentication
provideFirestore(getFirestore) → Firestore (wired up, ready for cloud sync)
```

### 3. State Management — `NoteService`

`NoteService` is the single source of truth for note data. It uses three RxJS streams:

| Stream                | Type                        | Purpose                                     |
|-----------------------|-----------------------------|---------------------------------------------|
| `notes$`              | `BehaviorSubject<Note[]>`   | Full reactive note list                     |
| `filteredNotes$`      | `BehaviorSubject<Note[]>`   | Notes currently matching search/tag filter  |
| `selectedNoteId$`     | `BehaviorSubject<string>`   | Currently selected note ID (cross-component)|
| `notesChanged`        | `Subject<void>`             | Pulse emitted after any mutation            |

**Persistence strategy** — on each mutation, `saveNotes()` serializes the in-memory array to `localStorage`. On boot, `loadNotes()` reads it back; if nothing is found, it fetches `notes-data.json` via `HttpClient` to seed sample notes.

### 4. Routing

```
/login                          → LoginComponent
/signup                         → SignupComponent
/forgot-password                → ForgotPasswordComponent
/reset-password                 → ResetPasswordComponent
/dashboard                      → DashboardComponent (layout shell)
  /dashboard/notes              → NotesDashboardComponent
  /dashboard/notes/:id          → NotesDashboardComponent (note selected)
  /dashboard/archived           → ArchivedNotesComponent
  /dashboard/create             → NoteCreateComponent
  /dashboard/settings           → SettingsComponent
/                               → redirects to /login
/notes                          → redirects to /dashboard/notes
```

> **Note:** The `authGuard` is fully written in `auth.guard.ts` but is currently commented out from the route definitions. It is ready to be enabled to protect all `/dashboard` routes.

### 5. Theme System — `ThemeService`

Themes are applied by setting the `data-theme` attribute on `<body>`. CSS custom properties in `styles.scss` handle the rest.

| Mode      | Behaviour                                                        |
|-----------|------------------------------------------------------------------|
| `light`   | Applies light CSS variable set                                   |
| `dark`    | Applies dark CSS variable set                                    |
| `system`  | Reads `prefers-color-scheme` and reacts to OS-level changes live |

Font choices (Noto Sans · Noto Serif · Monaco) are applied by updating the `--font-family` CSS variable on `:root` and saved to `localStorage`.

---

## 🔄 App Flow

### Authentication Flow

```
User visits "/" → redirected to /login

Login Page:
  - Reactive form (email + password)
  - Calls AuthService.login() → Firebase signInWithEmailAndPassword
  - On success → toast shown → navigate to /dashboard/notes
  - On failure → alert with error message
  
  Links: [Forgot Password] → /forgot-password
         [Sign Up]         → /signup

Sign Up Page:
  - Reactive form (email + password, min 8 chars)
  - Calls AuthService.signup() → Firebase createUserWithEmailAndPassword
  - On success → toast shown → navigate to /login

Forgot Password / Reset Password:
  - UI scaffold in place (logic ready to be wired to Firebase sendPasswordResetEmail)
```

### Main Dashboard Flow

```
/dashboard (DashboardComponent — layout shell)
  ├── <app-sidebar>              ← Collapsible nav: All Notes | Archived | Tags
  ├── <header>                   ← Page title + search input + settings button
  └── <router-outlet>            ← Child views rendered here

  Dashboard listens to:
    - window:resize → toggles mobile sidebar overlay
    - notes$ stream → re-runs search on data change
    - sidebar events → sectionChange, tagFilter, closeMobileSidebar
```

### Notes Dashboard Flow (`/dashboard/notes/:id`)

```
NotesDashboardComponent renders a two-panel layout:

LEFT PANEL — Note List
  - Renders getVisibleNotes(): applies active filter (all | archived | tag | search)
  - Each card shows: title, tags, relative lastEdited date
  - Clicking a card → selectNote(id) → router.navigate(['/dashboard/notes', id])
  - "Create New Note" button → /dashboard/create

RIGHT PANEL — Note Editor
  - Loads note by route param :id via noteService.getNoteById()
  - Inline editing: title (input), content (textarea), tags (input + chip remove)
  - Auto-save on blur (updateNote())
  - Manual save via "Save Note" button; cancel reverts to originalNote snapshot
  - Archive button → archiveNote() → moves note and navigates to next
  - Delete button → deleteNote() → permanently removes note
```

### Archived Notes Flow (`/dashboard/archived`)

```
ArchivedNotesComponent — two-panel layout (read-only):

LEFT PANEL — Archived List
  - Loads noteService.getArchivedNotes()
  - Cards show title, tags, date

RIGHT PANEL — Note Detail Viewer (read-only)
  - Restore Note → noteService.archiveNote(id, false) → note returns to active list
  - Delete Note  → noteService.deleteNote(id) → permanent deletion
```

### Note Creation Flow (`/dashboard/create`)

```
NoteCreateComponent:
  - Title input (max 100 chars, required)
  - Tags input (comma-separated, added on Enter or blur, shown as chips)
  - Content textarea (full-page height)
  - lastEdited display (relative, updates on each keystroke)
  - "Save Note" → validates title → noteService.createNote() → navigates to new note
  - "Cancel" → prompts if content exists, then navigates to /dashboard/notes
```

### Settings Flow (`/dashboard/settings`)

```
SettingsComponent — accordion-style sections:

  ► Color Theme    → Light / Dark / System (radio buttons, live preview)
  ► Font Theme     → Noto Sans / Noto Serif / Monaco (radio buttons)
  ► Change Password → Old + New + Confirm inputs with show/hide toggles
                      (validation: new >= 8 chars, must match confirm)
                      (Firebase password update logic ready to be wired)
  ► Logout          → confirm dialog → authService.logout() → /login
```

---

## 🧱 Data Model

```typescript
interface Note {
  id: string;          // UUID v4 (generated by NoteService)
  title: string;
  content: string;
  tags: string[];
  createdAt: Date;
  lastEdited: Date;    // Updated on every save/tag/archive action
  isArchived: boolean; // Soft-delete — moves to archived view
}
```

---

## ⚙️ NoteService API

| Method                                   | Description                                           |
|------------------------------------------|-------------------------------------------------------|
| `createNote(partial)`                    | Creates a new note, prepends to list, saves           |
| `getNotes()`                             | Returns all **active** (non-archived) notes           |
| `getArchivedNotes()`                     | Returns all **archived** notes                        |
| `getAllNotes()`                           | Returns every note regardless of archive status       |
| `getNoteById(id)`                        | Looks up a single note by UUID                        |
| `updateNote(note)`                       | Updates a note in-place, sets `lastEdited`, saves     |
| `archiveNote(id, archive?)`              | Toggles `isArchived`; defaults to archiving           |
| `deleteNote(id)`                         | Permanently removes note from array, saves            |
| `filterNotes(query, includeArchived?)`   | Searches title, content, and tags (case-insensitive)  |
| `searchNotes(query)`                     | Alias for `filterNotes(query, false)`                 |
| `getNotesWithTag(tag)`                   | Returns active notes that include the given tag       |
| `getAllTags()`                            | Unique sorted list of tags across all active notes    |
| `getRecentNotes(limit?)`                 | Top N notes sorted by `lastEdited` descending         |
| `duplicateNote(id)`                      | Creates a copy with " (Copy)" suffix                  |
| `exportNotes()`                          | Returns all notes as a formatted JSON string          |
| `importNotes(jsonString)`                | Merges valid notes from a JSON string into the store  |
| `getNotesCount()`                        | Returns `{ total, active, archived }` counts          |

---

## 🔧 Getting Started

### Prerequisites

- Node.js >= 18
- Angular CLI >= 19 (`npm install -g @angular/cli`)
- A Firebase project with **Authentication** and **Firestore** enabled

### Installation

```bash
# 1. Clone the repository
git clone <repo-url>
cd angular-note-taking-app-v2

# 2. Install dependencies
npm install

# 3. Configure Firebase
# Open src/environments/environment.ts and replace credentials with yours

# 4. Start the development server
npm start
# App runs at http://localhost:4200
```

### Build

```bash
npm run build        # Production build → dist/
npm run watch        # Dev build in watch mode
```

### Tests

```bash
npm test             # Run unit tests with Karma + Jasmine
```

---

## 🔐 Enabling Route Guards

The `AuthGuard` is written but disabled. To protect the dashboard:

1. Open `src/app/guards/auth.guard.ts` and uncomment the entire guard.
2. Open `src/app/app.routes.ts` and uncomment:
   ```typescript
   import { authGuard } from './guards/auth.guard';
   // then add canActivate: [authGuard] to the dashboard route
   ```
3. Add `isAuthenticated()` method to `AuthService`:
   ```typescript
   isAuthenticated(): boolean {
     return !!this.auth.currentUser;
   }
   ```

---

## 🌟 Future Features Roadmap

### 🔒 Security & Auth
- [ ] Enable `AuthGuard` on all dashboard routes (code already exists)
- [ ] Google OAuth login (UI button already present, logic to be wired)
- [ ] Forgot / Reset Password via Firebase `sendPasswordResetEmail` (pages exist)
- [ ] Connect Settings password form to Firebase `updatePassword()`
- [ ] Email verification on signup

### ☁️ Cloud Sync (Firestore)
- [ ] Migrate `NoteService` to read/write from Firestore (already wired in `app.config.ts`)
- [ ] Real-time sync across devices using Firestore `onSnapshot` listeners
- [ ] Per-user data isolation — scope Firestore queries to `auth.currentUser.uid`
- [ ] Offline support with Firestore persistence enabled

### ✏️ Rich Editor
- [ ] Markdown support — render `**bold**`, `# headings`, bullet lists, and code blocks
- [ ] Rich text (WYSIWYG) editor — integrate Quill, TipTap, or ProseMirror
- [ ] Code block syntax highlighting (e.g., Prism.js) — useful for dev notes
- [ ] Image embedding — attach/paste images stored in Firebase Storage

### 🗂️ Organisation & Discovery
- [ ] Note sorting — by date created, last edited, or title (A–Z / Z–A)
- [ ] Pinned notes — pin important notes to the top of the list
- [ ] Notebooks / Folders — group notes into named collections
- [ ] Note colour coding — assign background colours for visual scanning
- [ ] Advanced tag management — rename and delete tags globally
- [ ] Full-text search — Algolia or Firestore text index for deeper search

### 📤 Sharing & Export
- [ ] Export as PDF (using `jsPDF` or browser print API)
- [ ] Export as Markdown — download `.md` files
- [ ] Import from Markdown / plain text — paste or upload files
- [ ] Note sharing — generate a read-only public link per note

### 🔔 Productivity
- [ ] Reminders / Due dates — attach a date with browser notifications
- [ ] Note templates — pre-filled templates (meeting notes, bug report, etc.)
- [ ] Note duplication — `NoteService.duplicateNote()` exists, just needs a UI button
- [ ] Undo / Redo — history stack for edit operations
- [ ] Autosave indicator — real-time "saving…" / "saved ✓" status in the editor

### 🎨 UI/UX Polish
- [ ] Replace `alert()` / `confirm()` calls with `ToastComponent` + modal service
- [ ] Drag-and-drop reordering of notes in the list
- [ ] Keyboard shortcuts — `Ctrl+N` new note, `Ctrl+S` save, `Ctrl+K` search
- [ ] Mobile-optimised full-screen editor
- [ ] Sidebar collapse memory — persist state to `localStorage`
- [ ] Word / character count display in the editor

### 🧪 Testing
- [ ] Unit tests for `NoteService` (CRUD, filter, search logic)
- [ ] Unit tests for `ThemeService` (theme switching, persistence)
- [ ] Component tests for `NotesDashboardComponent` and `ArchivedNotesComponent`
- [ ] E2E tests with Playwright or Cypress (login → create → archive → delete flow)

---

## 🐛 Known Issues / Limitations

| Issue | Detail |
|-------|--------|
| Auth guard disabled | Dashboard routes are publicly accessible; guard code exists in `auth.guard.ts` |
| No cloud sync | Notes live only in `localStorage`; clearing browser storage loses all data |
| `alert()`/`confirm()` usage | Native dialogs should be replaced with the `ToastComponent` and a modal service |
| Archived note editor | Archived notes are read-only; no inline editing before restoring |
| Password change | Form UI and validation exist in Settings, but `updatePassword()` is not wired |
| Google login | Button present on login page but functionality not implemented |
| Forgot/Reset password | Pages exist but no Firebase email action is fired |
| `notes-list` component | Created as a stub; currently unused |
| `note-details` component | Created as a stub; currently unused |

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/my-feature`
3. Commit your changes: `git commit -m 'feat: add my feature'`
4. Push to the branch: `git push origin feature/my-feature`
5. Open a Pull Request

---

## 📄 License

This project is licensed under the **MIT License**.

---

## 👤 Author

Built as part of the **AmaliTech** frontend training programme.
