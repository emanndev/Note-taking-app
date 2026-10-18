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
  signOut,
  authState,
  User,
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

  login(email: string, password: string) {
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  signup(email: string, password: string) {
    return createUserWithEmailAndPassword(this.auth, email, password);
  }

  sendPasswordResetEmail(email: string) {
    return sendPasswordResetEmail(this.auth, email);
  }

  /**
   * Completes a password reset flow.
   * @param oobCode  The one-time code from the reset-password URL (?oobCode=...)
   * @param newPassword  The new password chosen by the user
   */
  confirmPasswordReset(oobCode: string, newPassword: string) {
    return confirmPasswordReset(this.auth, oobCode, newPassword);
  }

  logout() {
    signOut(this.auth).then(() => {
      this.router.navigate(['/login']);
    });
  }

  get currentUser() {
    return this.auth.currentUser;
  }

  /** Reactive boolean: emits true when logged in, false when logged out */
  isAuthenticated(): Observable<boolean> {
    return this.user$.pipe(map((user) => user !== null));
  }
}
