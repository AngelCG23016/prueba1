import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { OrganizationService } from '../../../services/organization.service';
import { DonationService } from '../../../services/donation.service';
import { UserRolesService } from '../../../services/user-roles.service'; 
import { Organization } from '../../../models/organization.model';
import { DonationFormComponent } from '../../../components/donations/donation-form/donation-form.component';
import { Observable } from 'rxjs'; 

// Componente para mostrar los detalles completos de una organización específica
//Muestra toda la información de la organización y permite realizar donaciones
@Component({
  selector: 'app-organization-detail',
  standalone: true,
  imports: [
    CommonModule, 
    DonationFormComponent
  ],
  templateUrl: './organization-detail.component.html',
  styleUrls: ['./organization-detail.component.css']
})
export class OrganizationDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private organizationService = inject(OrganizationService);
  private donationService = inject(DonationService);
  private userRolesService = inject(UserRolesService); 

  // Organización actual siendo visualizada
  organization: Organization | null = null;
  
  // Indica si está cargando los datos de la organización
  loading = true;
  
  // Total acumulado de donaciones para esta organización
  totalDonado: number = 0;
  
  // Controla la visibilidad del modal de donación
  showDonationModal: boolean = false;

  // Variable para controlar si el usuario es administrador
  isAdmin$: Observable<boolean>;

  constructor() {
    // Inicializar observable de permisos
    this.isAdmin$ = this.userRolesService.isAdmin();
  }

  // Método del ciclo de vida, se ejecuta al inicializar el componente
  // Obtiene el NIT de la ruta y carga la organización correspondiente
  ngOnInit() {
    const nit = this.route.snapshot.paramMap.get('nit');
    if (nit) {
      this.loadOrganization(nit);
      this.loadTotalDonado(nit);
    } else {
      this.loading = false;
      console.error('NIT no proporcionado en la ruta');
    }
  }

  // Carga los datos de una organización específica por su NIT
 
  loadOrganization(nit: string): void {
    this.loading = true;
    this.organizationService.getOrganizationByNit(nit).subscribe({
      next: (organization) => {
        this.organization = organization;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error cargando organización:', error);
        this.loading = false;
        alert('Error al cargar la organización');
      }
    });
  }

  // Carga el total de donaciones realizadas a esta organización
  loadTotalDonado(nit: string): void {
    this.donationService.obtenerTotalDonado(nit).subscribe({
      next: (response) => {
        this.totalDonado = response.total;
      },
      error: (error) => {
        console.error('Error cargando total donado:', error);
      }
    });
  }

  // Abre el modal para realizar una donación
  donate(): void {
    this.showDonationModal = true;
  }

  // Cierra el modal de donación
  closeDonationModal(): void {
    this.showDonationModal = false;
  }

  //Maneja el éxito de una donación
  //Cierra el modal, actualiza el total y muestra mensaje de éxito

  onDonationSuccess(): void {
    this.closeDonationModal();
    if (this.organization) {
      this.loadTotalDonado(this.organization.nit);
    }
    alert('¡Donación realizada exitosamente! Gracias por tu contribución.');
  }

  // Navega de regreso a la lista de organizaciones
  goBack(): void {
    this.router.navigate(['/panel/organizations']);
  }
}