import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Organization } from '../models/organization.model';

@Injectable({
  providedIn: 'root'
})
export class OrganizationService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api/organizaciones';

  // Obtiene la lista completa de todas las organizaciones registradas

  getOrganizations(): Observable<Organization[]> {
    return this.http.get<Organization[]>(this.apiUrl);
  }

  getOrganizationByNit(nit: string): Observable<Organization> {
    return this.http.get<Organization>(`${this.apiUrl}/${nit}`);
  }

  // Crea una nueva organización en el sistema

  createOrganization(organization: Organization): Observable<Organization> {
    return this.http.post<Organization>(this.apiUrl, organization);
  }

  // Actualiza los datos de una organización existente

  updateOrganization(nit: string, organization: Organization): Observable<Organization> {
    return this.http.put<Organization>(`${this.apiUrl}/${nit}`, organization);
  }

  // Elimina una organización del sistema

  deleteOrganization(nit: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${nit}`);
  }

  // Busca organizaciones por nombre

  searchOrganizationsByName(nombre: string): Observable<Organization[]> {
    return this.http.get<Organization[]>(`${this.apiUrl}/buscar?nombre=${nombre}`);
  }

  uploadLogo(file: File): Observable<{url: string}> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<{url: string}>(`${this.apiUrl}/upload-logo`, formData);
  }
}