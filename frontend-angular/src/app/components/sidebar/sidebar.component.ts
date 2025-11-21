import { Component, input, output, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Auth0IntegrationService } from '../../services/auth0.service';
import { UserRolesService } from '../../services/user-roles.service'; 
import { Observable } from 'rxjs'; 

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  isCollapsed = input.required<boolean>();
  toggleSidebar = output<void>();
  auth0Service = inject(Auth0IntegrationService);
  userRolesService = inject(UserRolesService);

  // Variables para control de roles
  isAdmin$: Observable<boolean>;

  constructor() {
    // Inicializar observable de permisos
    this.isAdmin$ = this.userRolesService.isAdmin();
  }

  // Obtiene el nombre de display del usuario para mostrar en la interfaz

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

  // Cierra la sesion del usuario actual

  logout(): void {
    this.auth0Service.logout();
  }
}