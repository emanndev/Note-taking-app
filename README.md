# Angular Notetaking App

## Overview
The Angular Notetaking App is a modern, responsive web application built with Angular 19.2.0, designed for creating, managing, and organizing notes. It features a clean, user-friendly interface with custom theming (light, dark, system), keyboard accessibility, and Firebase-based authentication. Notes are currently stored in localStorage, with sample data provided in notes-data.json. The app supports CRUD operations, note archiving, tag-based filtering, and responsive design for desktop and mobile devices. It meets all requirements of the lab activity, including foundational frontend skills, data-driven UI, and a partial full-stack extension with Firebase Auth.
Features

## Note Management:
Create, read, update, and delete (CRUD) notes with title, content, tags, and timestamps.
Archive notes and view them separately.
Filter notes by tags or search queries.


## Authentication:
Firebase-based login, signup, password reset, and logout.
Form validation with ReactiveForms for email and password.
Toast notifications for success/error feedback.


## Custom Theming:
Light, dark, and system themes, configurable via Settings.
Font options: Noto Sans, Noto Serif, Monaco.
CSS variables for consistent styling across components.


Responsive Design:
Mobile-friendly layouts with media queries (stacked layouts below 768px/480px).
Collapsible sidebar and slide-in mobile navigation.


## Accessibility:
Keyboard navigation with tabindex, role, and aria attributes.
Clear validation feedback for forms.


## Routing:
Protected routes for authenticated users (via auth.guard.ts, currently commented out).
Routes for login, signup, forgot password, reset password, and dashboard (notes, archived, create, settings).


## Data Persistence:
Notes stored in localStorage, with notes-data.json as default data.


## Technologies

Frontend: Angular 19.2.0, TypeScript 5.7.2, SCSS, RxJS 7.8.0
Backend: Firebase 11.9.1 (Authentication, partial Firestore setup)
Dependencies: @angular/fire, uuid (for note IDs), zone.js
Dev Tools: Angular CLI, Jasmine, Karma, Firebase CLI (for deployment)
Styling: CSS variables, Font Awesome (assumed for icons)

## Project Structure
angular-note-taking-app-v2/
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   ├── archived-notes/
│   │   │   ├── dashboard/
│   │   │   ├── forgot-password/
│   │   │   ├── login/
│   │   │   ├── note-create/
│   │   │   ├── note-details/
│   │   │   ├── notes-dashboard/
│   │   │   ├── notes-list/
│   │   │   ├── reset-password/
│   │   │   ├── settings/
│   │   │   ├── sidebar/
│   │   │   ├── signup/
│   │   │   ├── toast/
│   │   ├── models/
│   │   │   └── note.interface.ts
│   │   ├── services/
│   │   │   ├── auth.service.ts
│   │   │   ├── note.service.ts
│   │   │   ├── theme.service.ts
│   │   ├── app.config.ts
│   │   ├── app.routes.ts
│   │   ├── styles.scss
│   ├── assets/
│   │   └── notes-data.json
│   ├── environments/
│   │   ├── environment.ts
│   │   ├── environment.development.ts
├── package.json

## Setup Instructions
Prerequisites

Node.js (v18 or later)
Angular CLI (npm install -g @angular/cli@19.2.14)
Firebase account and project (note-taking-app-3890e)
Firebase CLI (npm install -g firebase-tools) for deployment

## Installation

Clone the Repository:git clone <repository-url>
cd angular-note-taking-app-v2


Install Dependencies:npm install


Set Up Firebase:
Ensure your Firebase project is configured in the Firebase console.
Verify environment.ts and environment.development.ts contain your Firebase configuration:export const environment = {
  production: false,
  firebase: {
    apiKey: 'AIzaSyCk78zpqePGOQH5WOfBpcsDnnnCAamqFOk',
    authDomain: 'note-taking-app-3890e.firebaseapp.com',
    projectId: 'note-taking-app-3890e',
    storageBucket: 'note-taking-app-3890e.firebasestorage.app',
    messagingSenderId: '940093464276',
    appId: '1:940093464276:web:d2b1961dcae5cb1afc2541',
  },
};




Run Locally:ng serve


Open http://localhost:4200 in your browser.


Build for Production:ng build --configuration production


# Deploy Angular App on AWS Amplify

This guide explains how to deploy your Angular application on **AWS Amplify** using your GitHub repository.

---

## Step 1: Connect Your Repository
1. Go to **AWS Amplify Console**.  
2. Choose **Host Web App**.  
3. Select **GitHub** and authorize Amplify to access your repository.  
4. Choose your Angular repo and branch (e.g., `main` or `dev`).  

---

## Step 2: Build & Deploy
Amplify automatically detects Angular and creates a build setting.  
If not, configure your **build settings** (`amplify.yml`):

```yaml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - npm ci
    build:
      commands:
        - npm run build --prod
  artifacts:
    baseDirectory: dist/<your-app-name>
    files:
      - '**/*'
  cache:
    paths:
      - node_modules/**/*
```

---

## Step 3: Amplify Hosting
Once the build completes, Amplify provides a URL:  

```
https://<your-app-name>.amplifyapp.com
```

You can now access your Angular app live.

---

## Why AWS Amplify?
We chose **AWS Amplify** because:  
- **GitHub Integration** → Automatic deployments from commits.  
- **Scalability** → Handles traffic spikes without manual configuration.  
- **Simplicity** → No servers or manual infrastructure setup required.  
- **Cost Efficiency** → Pay only for what you use. Hosting starts in the free tier, then as low as **$0.01 per build minute + $0.023/GB served**. Much cheaper and easier than manually configuring S3 + CloudFront for small–medium projects.

---

## Services Used
- **AWS Amplify** → For hosting, CI/CD, and deployment directly from GitHub.  


---

## Cost Efficiency
- **Amplify Free Tier**: First 12 months include 1000 build minutes + 5GB hosting free.  
- After free tier:  
  - $0.01 per build minute.  
  - $0.023/GB of content served.  

This makes Amplify **the most cost-efficient AWS service** for deploying personal projects, startups, and small businesses.

---

### 🛠 Final Result
After deployment, your Angular app is live at the Amplify URL with automatic CI/CD from your GitHub repo.



## Usage

**Sign Up/Login:**
Navigate to /signup or /login to create an account or log in using Firebase Auth.
Use the "Forgot Password" link to request a password reset (simulated alert).
Reset passwords via /reset-password (simulated success).


**Manage Notes:**
Access the dashboard at /dashboard/notes to view all notes.
Create a new note at /dashboard/create.
Edit or delete notes in /dashboard/notes/:id.
Archive notes and view them at /dashboard/archived.
Filter notes by tags using the sidebar.


**Customize Settings:**
Go to /dashboard/settings to change theme (light/dark/system), font (Noto Sans/Noto Serif/Monaco), or password.
Log out to return to /login.


**Responsive Design:**
The app adapts to mobile devices, with a slide-in sidebar and stacked layouts.


88Accessibility:**
Use keyboard navigation (Tab, Enter, Space) for all interactive elements.
Form validation provides clear feedback for errors.



## Development Notes

Data Persistence: Notes are stored in localStorage, initialized with notes-data.json. To enable Firestore for real-time syncing, update NoteService to use Firebase Firestore APIs (see Future Enhancements).
Authentication Guard: The auth.guard.ts is commented out but can be enabled to protect dashboard routes.
Icons: The app assumes Font Awesome for icons (e.g., fas fa-home in sidebar.component.html). Ensure the library is included in index.html or via CDN.
Testing: Run ng test to execute unit tests with Jasmine and Karma.

## Future Enhancements

Firestore Integration: Replace localStorage with Firestore for real-time note syncing across devices, using the existing Firebase configuration.
Rich Text Editing: Add a WYSIWYG editor (e.g., Quill) for formatted note content.
Note Sharing/Collaboration: Enable sharing notes or real-time collaboration via Firestore.
Advanced Search: Implement full-text search across note titles and content.
Offline Support: Add service workers for offline note access using Angular PWA.

## Contributing

Fork the repository and create a feature branch.
Follow Angular style guides and ensure SCSS uses CSS variables.
Write unit tests for new features and run ng test.
Submit a pull request with clear descriptions of changes.

## License
No lincense
