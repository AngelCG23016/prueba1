import { Injectable, inject } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { UserRolesService } from '../services/user-roles.service'; 
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  private userRolesService = inject(UserRolesService); 
  private router = inject(Router);

  //verifica si el usuario actual tiene permisos de administrador antes de permitir el acceso a rutas protegidas

  canActivate(): Observable<boolean> {
    return this.userRolesService.isAdmin().pipe( 
      tap(isAdmin => {
        console.log('AdminGuard - Usuario es admin:', isAdmin);
        if (!isAdmin) {
          console.warn('Acceso denegado. Redirigiendo a /unauthorized');
          this.router.navigate(['/unauthorized']);
        }
      })
    );
  }
}