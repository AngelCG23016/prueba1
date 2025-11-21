import { Injectable, inject } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserRolesService {
  private auth = inject(AuthService);

  // Obtener roles del usuario desde el token
  getUserRoles(): Observable<string[]> {
    return this.auth.idTokenClaims$.pipe(
      map(claims => {
        const roles = claims?.['https://appoyar.com/roles'] || 
                     claims?.['roles'] || 
                     [];
        return Array.isArray(roles) ? roles : [roles];
      })
    );
  }

  hasRole(role: string): Observable<boolean> {
    return this.getUserRoles().pipe(
      map(roles => roles.includes(role))
    );
  }

  isAdmin(): Observable<boolean> {
    return this.hasRole('admin');
  }

  canEditOrganizations(): Observable<boolean> {
    return this.isAdmin();
  }

  canEditProducts(): Observable<boolean> {
    return this.isAdmin();
  }
}