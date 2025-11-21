import { User } from './user.model';
import { Organization } from './organization.model';

//Modelo que representa una Donación en el sistema
export interface Donation {
  id?: number;
  organizacion: Organization; 
  usuario: User;
  monto: number;
  metodoPago: string;
  fechaDonacion?: string;
  estado?: string;
  referenciaPago?: string;
}

// Modelo para procesamiento de pagos con tarjeta de crédito
export interface CreditCardPayment {
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  cardHolder: string;
  amount: number;
  nitOrganizacion: string;
}

// Modelo para procesamiento de pagos con PayPal
export interface PayPalPayment {
  email: string;
  password: string;
  amount: number;
  nitOrganizacion: string;
}