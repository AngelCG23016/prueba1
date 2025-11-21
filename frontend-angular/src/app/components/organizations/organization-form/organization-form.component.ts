import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { OrganizationService } from '../../../services/organization.service';
import { Organization } from '../../../models/organization.model';
import { firstValueFrom } from 'rxjs';

// Componente para crear y editar organizaciones 
@Component({
  selector: 'app-organization-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './organization-form.component.html',
  styleUrls: ['./organization-form.component.css']
})
export class OrganizationFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private organizationService = inject(OrganizationService);

  organizationForm: FormGroup;
  
  isEditMode = false;
  
  currentNit: string = '';
  
  loading = false;
  
  previewUrl: string | null = null;

  // Constructor: inicializa el formulario reactivo con validaciones
   
  constructor() {
    this.organizationForm = this.fb.group({
      nit: ['', [
        Validators.required, 
        Validators.pattern(/^[0-9]+$/),
        Validators.maxLength(14)
      ]],
      nombre: ['', [
        Validators.required,
        Validators.maxLength(25),
        Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ0-9\s]+$/)
      ]],
      descripcion: ['', [
        Validators.maxLength(100)
      ]],
      logoUrl: ['', [
        Validators.maxLength(100)
      ]],
      nombreInscriptor: ['', [
        Validators.required,
        Validators.maxLength(50),
        Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)
      ]],
      rol: ['', [
        Validators.required,
        Validators.maxLength(50),
        Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ0-9\s]+$/)
      ]],
      correo: ['', [
        Validators.required, 
        Validators.email,
        Validators.maxLength(50)
      ]],
      contraseña: ['', [
        Validators.required, 
        Validators.minLength(6),
        Validators.maxLength(50)
      ]]
    });
  }

  ngOnInit() {
    const nit = this.route.snapshot.paramMap.get('nit');
    if (nit) {
      this.isEditMode = true;
      this.currentNit = nit;
      this.loadOrganization(nit);
    }
  }

 
  loadOrganization(nit: string): void {
    this.loading = true;
    this.organizationService.getOrganizationByNit(nit).subscribe({
      next: (organization) => {
        this.organizationForm.patchValue(organization);
        if (organization.logoUrl) {
          this.previewUrl = organization.logoUrl;
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error cargando organización:', error);
        this.loading = false;
      }
    });
  }

  // Actualiza la previsualización cuando cambia la URL del logo
   
  updatePreview(): void {
    const logoUrl = this.organizationForm.get('logoUrl')?.value;
    if (logoUrl && this.isValidUrl(logoUrl)) {
      this.previewUrl = logoUrl;
    } else {
      this.previewUrl = null;
    }
  }

  // Valida si una URL es válida para mostrar como preview
  
  private isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }


  removeImage(): void {
    this.previewUrl = null;
    this.organizationForm.patchValue({ logoUrl: '' });
  }

 
  private cleanFormData(formData: any): any {
    return {
      nit: formData.nit ? formData.nit.trim() : '',
      nombre: formData.nombre ? formData.nombre.trim() : '',
      descripcion: formData.descripcion ? formData.descripcion.trim() : '',
      logoUrl: formData.logoUrl ? formData.logoUrl.trim() : '',
      nombreInscriptor: formData.nombreInscriptor ? formData.nombreInscriptor.trim() : '',
      rol: formData.rol ? formData.rol.trim() : '',
      correo: formData.correo ? formData.correo.trim() : '',
      contraseña: formData.contraseña ? formData.contraseña.trim() : ''
    };
  }

  
  async onSubmit(): Promise<void> {
    if (this.organizationForm.valid) {
      this.loading = true;

      try {
        const cleanedData = this.cleanFormData(this.organizationForm.value);

        const organizationData: Organization = {
          nit: cleanedData.nit,
          nombre: cleanedData.nombre,
          descripcion: cleanedData.descripcion,
          logoUrl: cleanedData.logoUrl,
          nombreInscriptor: cleanedData.nombreInscriptor,
          rol: cleanedData.rol,
          correo: cleanedData.correo,
          contraseña: cleanedData.contraseña
        };

        console.log('Enviando datos al backend:', organizationData);

        // Determinar si es creación o actualización
        const operation = this.isEditMode 
          ? this.organizationService.updateOrganization(this.currentNit, organizationData)
          : this.organizationService.createOrganization(organizationData);

        operation.subscribe({
          next: (response) => {
            console.log('Respuesta exitosa del backend:', response);
            this.loading = false;
            this.router.navigate(['/panel/organizations']);
          },
          error: (error) => {
            console.error('Error del backend:', error);
            this.loading = false;
            
            let errorMessage = 'Error al guardar la organización';
            if (error.error && error.error.message) {
              errorMessage += ': ' + error.error.message;
            } else if (error.status === 500) {
              errorMessage += '. Error interno del servidor.';
            } else if (error.status === 400) {
              errorMessage += '. ' + (error.error?.error || 'Datos inválidos.');
            }
            
            alert(errorMessage);
          }
        });

      } catch (error) {
        console.error('Error inesperado:', error);
        this.loading = false;
        alert('Error inesperado: ' + error);
      }
    } else {
      console.log('Formulario inválido');
      Object.keys(this.organizationForm.controls).forEach(key => {
        this.organizationForm.get(key)?.markAsTouched();
      });
    }
  }

  // Cancela la operación y regresa a la lista de organizaciones.
  cancel(): void {
    this.router.navigate(['/panel/organizations']);
  }
}