// import { inject, Injectable } from '@angular/core';
// import { CanActivateFn, Router } from '@angular/router';
// import { AuthService } from '../services/auth.service';

// export const authGuard: CanActivateFn = (route, state) => {
//   const authService = inject(AuthService);
//   const router = inject(Router);

//   // check if user is authenticated and allow access
//   if (authService.isAuthenticated()) {
//     return true;
//   } else {
//     // if not authenticated, redirect to login
//     router.navigate(['/login']);
//     return false;
//   }
// };

