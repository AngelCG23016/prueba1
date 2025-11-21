import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { from, switchMap } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);

  // Para endpoints públicos, no agregar token
  if (req.url.includes('/api/public/') || 
      (req.url.includes('/api/organizaciones') && req.method === 'GET')) {
    return next(req);
  }

  // Obtener el token y agregarlo a la request
  return from(auth.getAccessTokenSilently()).pipe(
    switchMap(token => {
      if (token) {
        const authReq = req.clone({
          headers: req.headers.set('Authorization', `Bearer ${token}`)
        });
        return next(authReq);
      }
      return next(req);
    })
  );
};