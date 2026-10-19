import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map, take } from 'rxjs/operators';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.user$.pipe(
    take(1),
    map((user) => {
      // 1. If not logged in, redirect to /login
      if (!user) {
        return router.createUrlTree(['/login'], {
          queryParams: { returnUrl: state.url },
        });
      }

      // 2. If logged in but email is not verified, block access and redirect to /verify-email
      if (!user.emailVerified) {
        return router.createUrlTree(['/verify-email']);
      }

      // 3. User is authenticated and verified
      return true;
    })
  );
};
