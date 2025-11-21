import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpHandler, HttpRequest, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Auth0IntegrationService } from '../services/auth0.service';

@Injectable()
export class Auth0SyncInterceptor implements HttpInterceptor {
  constructor(private auth0Service: Auth0IntegrationService) {}

  // Intercepta todas las peticiones HTTP de la aplicación

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (req.url.includes('/api/usuarios') && req.method === 'POST') {
      return next.handle(req);
    }

    return next.handle(req).pipe(
      tap(event => {
      })
    );
  }
}