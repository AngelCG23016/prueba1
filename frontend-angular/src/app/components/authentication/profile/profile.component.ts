import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Auth0IntegrationService } from '../../../services/auth0.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {

  // Servicio de autenticacion que proporciona informacion del usuario

  auth0Service = inject(Auth0IntegrationService);

  // Obtiene el nombre de display mas amigable para el usuario

  getUserDisplayName(user: any): string {
    if (user.name && user.name !== user.email) {
      return user.name;
    }
    if (user.nickname && user.nickname !== user.email) {
      return user.nickname;
    }
    
    const emailPart = user.email.split('@')[0];
    const cleanName = emailPart.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ]/g, '');
    
    if (cleanName && cleanName.length > 1) {
      return cleanName.charAt(0).toUpperCase() + cleanName.slice(1).toLowerCase();
    }
    
    return 'Usuario';
  }

  // Cierra la sesion del usuario actual y redirige a la pagina principal

  logout(): void {
    this.auth0Service.logout();
  }
}