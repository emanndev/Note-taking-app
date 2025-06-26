import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private tokenKey = 'authToken';
  constructor(private router: Router) {}

  //saving token in localstorage
  login(): void {
    localStorage.setItem(this.tokenKey, 'myFakeToken');
  }

  //removing token from localstorage
  logout(): void {
    localStorage.removeItem(this.tokenKey);
    this.router.navigate(['/login']);
  }

  //checking if token is present to authenticate user
  isAuthenticated(): boolean {
    const token = localStorage.getItem(this.tokenKey);
    return token !== null;
  }
}
