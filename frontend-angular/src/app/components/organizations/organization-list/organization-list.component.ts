import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { OrganizationService } from '../../../services/organization.service';
import { DonationService } from '../../../services/donation.service';
import { UserRolesService } from '../../../services/user-roles.service';
import { Organization } from '../../../models/organization.model';
import { DonationFormComponent } from '../../../components/donations/donation-form/donation-form.component';
import { Observable, take } from 'rxjs';

// Componente para mostrar la lista de todas las organizaciones
// ver, editar, eliminar y crear nuevas organizaciones

@Component({
  selector: 'app-organization-list',
  standalone: true,
  imports: [CommonModule, DonationFormComponent],
  templateUrl: './organization-list.component.html',
  styleUrls: ['./organization-list.component.css']
})
export class OrganizationListComponent implements OnInit {
  private organizationService = inject(OrganizationService);
  private donationService = inject(DonationService);
  private userRolesService = inject(UserRolesService);
  private router = inject(Router);

  organizations: Organization[] = [];
  loading = true;
  showSuccessMessage = false;
  successMessage = '';

  // Variables para control de roles
  canEdit$: Observable<boolean>;
  canCreate$: Observable<boolean>;
  canDelete$: Observable<boolean>;

  // Variables para el modal de donación
  showDonationModal = false;
  selectedOrganization: Organization | null = null;

  constructor() {
    // Inicializar los observables de permisos
    this.canEdit$ = this.userRolesService.canEditOrganizations();
    this.canCreate$ = this.userRolesService.canEditOrganizations();
    this.canDelete$ = this.userRolesService.canEditOrganizations();
  }

  ngOnInit() {
    this.loadOrganizations();
  }

  // Carga la lista de organizaciones desde el servidor
  loadOrganizations(): void {
    this.loading = true;
    this.organizationService.getOrganizations().subscribe({
      next: (organizations) => {
        this.organizations = organizations;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error cargando organizaciones:', error);
        this.loading = false;
        alert('Error al cargar las organizaciones. Verifica que el servidor esté corriendo.');
      }
    });
  }

  // Navega a la vista de detalle de una organización
  viewOrganization(nit: string): void {
    this.router.navigate(['/panel/organizations', nit]);
  }

  // Navega al formulario para crear una nueva organización
  createOrganization(): void {
    this.canCreate$.pipe(take(1)).subscribe(canCreate => { 
      if (!canCreate) {
        alert('No tienes permisos para crear organizaciones. Solo los administradores pueden realizar esta acción.');
        return;
      }
      this.router.navigate(['/panel/organizations/new']);
    });
  }

  // Navega al formulario de edición de una organización
  editOrganization(event: Event, nit: string): void {
    event.stopPropagation();
    
    this.canEdit$.pipe(take(1)).subscribe(canEdit => { 
      if (!canEdit) {
        alert('No tienes permisos para editar organizaciones. Solo los administradores pueden realizar esta acción.');
        return;
      }
      this.router.navigate(['/panel/organizations/edit', nit]);
    });
  }

  // Elimina una organización después de confirmación del usuario 
  deleteOrganization(event: Event, nit: string, nombre: string): void {
    event.stopPropagation();
    
    this.canDelete$.pipe(take(1)).subscribe(canDelete => { 
      if (!canDelete) {
        alert('No tienes permisos para eliminar organizaciones. Solo los administradores pueden realizar esta acción.');
        return;
      }
      
      if (confirm(`¿Estás seguro de que quieres eliminar la organización "${nombre}"?`)) {
        this.organizationService.deleteOrganization(nit).subscribe({
          next: () => {
            this.showSuccess('Organización eliminada exitosamente');
            this.loadOrganizations();
          },
          error: (error) => {
            console.error('Error eliminando organización:', error);
            
            // Manejar error de concurrencia (si la organización ya fue eliminada)
            if (error.status === 500) {
              this.showSuccess('Organización eliminada exitosamente');
              this.loadOrganizations();
            } else {
              alert('Error al eliminar la organización');
            }
          }
        });
      }
    });
  }

  // Abre el modal de donación para una organización específica
  donateOrganization(event: Event, organization: Organization): void {
    event.stopPropagation();
    this.selectedOrganization = organization;
    this.showDonationModal = true;
  }

  // Cierra el modal de donación
  closeDonationModal(): void {
    this.showDonationModal = false;
    this.selectedOrganization = null;
  }

  // Maneja el éxito de una donación
  onDonationSuccess(): void {
    this.closeDonationModal();
    this.showSuccess('¡Donación realizada exitosamente! Gracias por tu contribución.');
  }

  private showSuccess(message: string): void {
    this.successMessage = message;
    this.showSuccessMessage = true;
    
    setTimeout(() => {
      this.showSuccessMessage = false;
    }, 3000);
  }

  // Debug para verificar roles
  debugRoles(): void {
    this.userRolesService.getUserRoles().subscribe(roles => {
      console.log('🔐 Roles del usuario:', roles);
    });
    
    this.userRolesService.isAdmin().subscribe(isAdmin => {
      console.log('🔐 Es administrador:', isAdmin);
    });
  }
}