import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '@auth0/auth0-angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './auth-button.component.html',
  styleUrls: ['./auth-button.component.css']
})
export class AuthButtonComponent {
  auth = inject(AuthService);
  private router = inject(Router);

  // Inicia el proceso de login redirigiendo a Auth0

  login(): void {
    this.auth.loginWithRedirect({
      appState: { target: '/panel' }
    });
  }

  // Cierra y limpia la sesión de Auth0 y redirige a la página principal

  logout(): void {
    this.auth.logout({
      logoutParams: {
        returnTo: window.location.origin
      }
    });
  }
}