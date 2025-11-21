import { Injectable, inject } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { filter, tap } from 'rxjs/operators';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class Auth0IntegrationService {
  private auth = inject(AuthService);
  private userService = inject(UserService);

  // Maneja el flujo de autenticacion y sincronizacion de usuarios

  user$ = this.auth.user$.pipe(
    filter(user => !!user),        // Solo procesa cuando hay un usuario autenticado
    tap(user => {
      console.log('Usuario de Auth0:', user);
      this.syncUserWithBackend(user);   // Sincroniza automaticamente con el backend
    })
  );

  isAuthenticated$ = this.auth.isAuthenticated$;

  // Genera un nombre de usuario a partir de la información de Auth0

  private generateUsername(auth0User: any): string {
  
    if (auth0User.name && auth0User.name !== auth0User.email) {
      return auth0User.name;
    }

    if (auth0User.nickname && auth0User.nickname !== auth0User.email) {
      return auth0User.nickname;
    }

    const email = auth0User.email;
    if (email) {
      const usernamePart = email.split('@')[0];
      
      const cleanName = usernamePart.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, '');
      
      if (cleanName && cleanName.length > 1) {
    
        return cleanName.charAt(0).toUpperCase() + cleanName.slice(1).toLowerCase();
      }
      
      return 'Usuario_' + auth0User.sub.substring(0, 5);
    }

    return 'Usuario_' + auth0User.sub.substring(0, 8);
  }

  // Sincroniza el usuario de Auth0 con la base de datos del backend

  private syncUserWithBackend(auth0User: any) {
    const generatedName = this.generateUsername(auth0User);
    
    const userData = {
      nombre: generatedName,
      correo: auth0User.email,
      passwordHash: 'auth0_' + auth0User.sub
    };

    console.log('Generando nombre de usuario:', {
      email: auth0User.email,
      nameFromAuth0: auth0User.name,
      nickname: auth0User.nickname,
      generatedName: generatedName
    });

    this.userService.createUser(userData).subscribe({
      next: (user) => {
        console.log('Usuario sincronizado con backend:', user);
      },
      error: (error) => {
        if (error.status === 400 || error.status === 409) {
          console.log('Usuario ya existe en la base de datos');
        } else {
          console.error('Error sincronizando usuario:', error);
        }
      }
    });
  }

  // Verifica si el usuario está actualmente autenticado

  isAuthenticated() {
    return this.auth.isAuthenticated$;
  }

  // Obtiene la informacion del usuario actualmente autenticado

  getUser() {
    return this.auth.user$;
  }

  // Inicia el proceso de login redirigiendo a la pagina de Auth0

  login() {
    this.auth.loginWithRedirect({
      authorizationParams: {
        screen_hint: 'login'
      },
      appState: { target: '/panel' }
    });
  }

  // Inicia el proceso de registro redirigiendo a la pagina de Auth0

  signup() {
    this.auth.loginWithRedirect({
      authorizationParams: {
        screen_hint: 'signup'
      },
      appState: { target: '/panel' }
    });
  }

  // Cierra la sesión del usuario actual y redirige a la pagina principal

  logout() {
    this.auth.logout({
      logoutParams: {
        returnTo: window.location.origin
      }
    });
  }
}