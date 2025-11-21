import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Donation, CreditCardPayment, PayPalPayment } from '../models/donation.model';
import { User } from '../models/user.model';

//Servicio para manejar todas las operaciones relacionadas con Donaciones

@Injectable({
  providedIn: 'root'
})
export class DonationService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api/donaciones';

  // Registra una nueva donación en el sistema.
  registrarDonacion(donation: Donation): Observable<Donation> {
    return this.http.post<Donation>(this.apiUrl, donation);
  }

  //Procesa un pago con tarjeta de crédito
  procesarPagoTarjeta(payment: CreditCardPayment): Observable<any> {
    return this.http.post(`${this.apiUrl}/procesar/tarjeta`, payment);
  }

  // Procesa un pago con PayPal
  procesarPagoPayPal(payment: PayPalPayment): Observable<any> {
    return this.http.post(`${this.apiUrl}/procesar/paypal`, payment);
  }

  // Obtiene las donaciones de una organización
  obtenerDonacionesPorOrganizacion(nit: string): Observable<Donation[]> {
    return this.http.get<Donation[]>(`${this.apiUrl}/organizacion/${nit}`);
  }

  // obtiene las donaciones de un usuario por su ID
  obtenerDonacionesPorUsuario(idUsuario: number): Observable<Donation[]> {
    return this.http.get<Donation[]>(`${this.apiUrl}/usuario/${idUsuario}`);
  }

  // Obtiene el total donado a una organización
  obtenerTotalDonado(nit: string): Observable<{total: number}> {
    return this.http.get<{total: number}>(`${this.apiUrl}/organizacion/${nit}/total`);
  }
}