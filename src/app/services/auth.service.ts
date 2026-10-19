import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  Auth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  confirmPasswordReset,
  sendEmailVerification,
  reload,
  signOut,
  authState,
  User,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence,
  UserCredential,
} from '@angular/fire/auth';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  /** Reactive stream of the current Firebase user (null when logged out) */
  readonly user$: Observable<User | null>;

  constructor(private router: Router, private auth: Auth) {
    this.user$ = authState(this.auth);
  }

  /**
   * Set authentication persistence.
   * @param rememberMe When true, persists across browser restarts (local storage).
   *                   When false, persists only for current browser session (session storage).
   */
  async setSessionPersistence(rememberMe: boolean = true): Promise<void> {
    const persistence = rememberMe
      ? browserLocalPersistence
      : browserSessionPersistence;
    await setPersistence(this.auth, persistence);
  }

  /**
   * Logs in a user with email and password, setting persistence accordingly.
   */
  async login(
    email: string,
    password: string,
    rememberMe: boolean = true
  ): Promise<UserCredential> {
    await this.setSessionPersistence(rememberMe);
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  /**
   * Creates a new user account and immediately dispatches a verification email.
   */
  async signup(email: string, password: string): Promise<UserCredential> {
    const credential = await createUserWithEmailAndPassword(
      this.auth,
      email,
      password
    );
    if (credential.user) {
      try {
        await this.sendVerificationEmail(credential.user);
      } catch (err) {
        console.warn('Failed to send initial verification email:', err);
      }
    }
    return credential;
  }

  /**
   * Sends or resends an email verification link.
   */
  async sendVerificationEmail(user?: User): Promise<void> {
    const targetUser = user || this.auth.currentUser;
    if (!targetUser) {
      throw new Error('No user is currently signed in to verify.');
    }
    await sendEmailVerification(targetUser);
  }

  /**
   * Reloads the current user profile from Firebase to refresh emailVerified status.
   */
  async reloadUser(): Promise<User | null> {
    const user = this.auth.currentUser;
    if (user) {
      await reload(user);
    }
    return this.auth.currentUser;
  }

  /**
   * Synchronous check for current user's email verification status.
   */
  get isEmailVerified(): boolean {
    return !!this.auth.currentUser?.emailVerified;
  }

  /**
   * Reactive stream emitting boolean for email verification status.
   */
  get isEmailVerified$(): Observable<boolean> {
    return this.user$.pipe(map((user) => !!user?.emailVerified));
  }

  sendPasswordResetEmail(email: string) {
    return sendPasswordResetEmail(this.auth, email);
  }

  /**
   * Completes a password reset flow.
   * @param oobCode The one-time code from the reset-password URL (?oobCode=...)
   * @param newPassword The new password chosen by the user
   */
  confirmPasswordReset(oobCode: string, newPassword: string) {
    return confirmPasswordReset(this.auth, oobCode, newPassword);
  }

  logout() {
    signOut(this.auth).then(() => {
      this.router.navigate(['/login']);
    });
  }

  get currentUser(): User | null {
    return this.auth.currentUser;
  }

  /** Reactive boolean: emits true when logged in, false when logged out */
  isAuthenticated(): Observable<boolean> {
    return this.user$.pipe(map((user) => user !== null));
  }
}
