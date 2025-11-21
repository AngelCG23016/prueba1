import { Component, Input, Output, EventEmitter, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { DonationService } from '../../../services/donation.service';
import { Auth0IntegrationService } from '../../../services/auth0.service';
import { UserService } from '../../../services/user.service';
import { UserRolesService } from '../../../services/user-roles.service';
import { Organization } from '../../../models/organization.model';
import { Donation } from '../../../models/donation.model';
import { User } from '../../../models/user.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-donation-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './donation-form.component.html',
  styleUrls: ['./donation-form.component.css']
})
export class DonationFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private donationService = inject(DonationService);
  private auth0Service = inject(Auth0IntegrationService);
  private userService = inject(UserService);
  private userRolesService = inject(UserRolesService);

  @Input() organization!: Organization;
  @Output() donationSuccess = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  donationForm: FormGroup;
  creditCardForm: FormGroup;
  paypalForm: FormGroup;
  
  activeTab: 'creditCard' | 'paypal' = 'creditCard';
  loading = false;
  donationAmount: number = 10;
  currentUser: User | null = null;
  auth0User: any = null;

   // Variables para control de permisos

  isAdmin$: Observable<boolean>;
  showFictitiousData: boolean = false;

  fictitiousCreditCards = [
    { number: '4509 0092 4232 0001', type: 'Visa', holder: 'Admin Admin' }
  ];

  fictitiousPayPalAccounts = [
    { email: 'usuario@ejemplo.com', password: 'password123' }
  ];

  constructor() {
    this.isAdmin$ = this.userRolesService.isAdmin();

    // control de visibilidad de datos
    
    this.isAdmin$.subscribe(isAdmin => {
      this.showFictitiousData = isAdmin;
    });

    this.donationForm = this.fb.group({
      amount: [10, [Validators.required, Validators.min(1), Validators.max(100000)]]
    });

    this.creditCardForm = this.fb.group({
      cardNumber: ['', [
        Validators.required, 
        Validators.pattern(/^[0-9\s]{13,19}$/)
      ]],
      expiryDate: ['', [
        Validators.required, 
        Validators.pattern(/^(0[1-9]|1[0-2])\/([0-9]{2})$/),
        this.futureDateValidator
      ]],
      cvv: ['', [
        Validators.required, 
        Validators.pattern(/^[0-9]{3,4}$/)
      ]],
      cardHolder: ['', [
        Validators.required,
        Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{2,30}$/),
        Validators.maxLength(30)
      ]]
    });

    this.paypalForm = this.fb.group({
      email: ['', [
        Validators.required, 
        Validators.email,
        Validators.maxLength(50)
      ]],
      password: ['', [
        Validators.required,
        Validators.maxLength(20)
      ]]
    });
  }

  // Validador de fecha de expiración
  // Verifica que la fecha de expiración de la tarjeta sea futura
  // Compara la fecha ingresada con la fecha actual y retorna error si ya expiró

  private futureDateValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    
    if (!value || !/^(0[1-9]|1[0-2])\/([0-9]{2})$/.test(value)) {
      return null;
    }

    const [month, year] = value.split('/');
    const expiryDate = new Date(2000 + parseInt(year), parseInt(month) - 1);
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();

    const currentMonthFirstDay = new Date(currentYear, currentMonth, 1);

    if (expiryDate < currentMonthFirstDay) {
      return { expired: true };
    }

    return null;
  }

  private generateFutureExpiryDate(): string {
    const currentDate = new Date();
    const futureDate = new Date(currentDate.getFullYear() + 3, currentDate.getMonth());
    
    const month = (futureDate.getMonth() + 1).toString().padStart(2, '0');
    const year = futureDate.getFullYear().toString().slice(-2);
    
    return `${month}/${year}`;
  }

  ngOnInit(): void {
    this.loadCurrentUser();
  }

  // Carga el usuario actual desde Auth0 y base de datos
  // Obtiene el usuario autenticado de Auth0 y sincroniza con la base de datos local

  private loadCurrentUser(): void {
    this.auth0Service.getUser().subscribe({
      next: (auth0User) => {
        console.log('Usuario de Auth0 obtenido:', auth0User);
        this.auth0User = auth0User;
        
        if (auth0User && auth0User.email) {
          this.userService.getUserByEmail(auth0User.email).subscribe({
            next: (user) => {
              console.log('Usuario encontrado en BD:', user);
              this.currentUser = user;
            },
            error: (error) => {
              console.error('Error obteniendo usuario de la base de datos:', error);
              this.createUserInDatabase(auth0User);
            }
          });
        } else {
          console.warn('Usuario de Auth0 no tiene email');
          this.createDefaultUser();
        }
      },
      error: (error) => {
        console.error('Error obteniendo usuario de Auth0:', error);
        this.createDefaultUser();
      }
    });
  }

  private createUserInDatabase(auth0User: any): void {
    console.log('Creando usuario en la base de datos...');
    this.userService.syncUserAfterAuth0(auth0User).subscribe({
      next: (newUser) => {
        console.log('Usuario creado exitosamente:', newUser);
        this.currentUser = newUser;
      },
      error: (error) => {
        console.error('Error creando usuario en BD:', error);
        this.currentUser = {
          id: 0,
          nombre: auth0User.name || auth0User.nickname || 'Usuario',
          correo: auth0User.email || 'usuario@ejemplo.com'
        };
        console.log('Usuario temporal creado:', this.currentUser);
      }
    });
  }

  private createDefaultUser(): void {
    this.currentUser = {
      id: 0,
      nombre: 'Usuario No Autenticado',
      correo: 'usuario@ejemplo.com'
    };
    console.log('Usuario por defecto creado:', this.currentUser);
  }

  onNumberKeyPress(event: KeyboardEvent): void {
    const charCode = event.key.charCodeAt(0);
    if ((charCode < 48 || charCode > 57) && 
        event.key !== 'Backspace' && 
        event.key !== 'Delete' && 
        event.key !== 'Tab' && 
        event.key !== 'ArrowLeft' && 
        event.key !== 'ArrowRight') {
      event.preventDefault();
    }
  }

  onLetterKeyPress(event: KeyboardEvent): void {
    const charCode = event.key.charCodeAt(0);
    const allowedChars = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]$/;
    if (!allowedChars.test(event.key) && 
        event.key !== 'Backspace' && 
        event.key !== 'Delete' && 
        event.key !== 'Tab' && 
        event.key !== 'ArrowLeft' && 
        event.key !== 'ArrowRight') {
      event.preventDefault();
    }
  }

  selectTab(tab: 'creditCard' | 'paypal'): void {
    this.activeTab = tab;
  }

  setAmount(amount: number): void {
    this.donationAmount = amount;
    this.donationForm.patchValue({ amount: amount });
  }

  // Formatea el número de tarjeta con espacios cada 4 dígitos
  // Toma el input del usuario y lo formatea automáticamente en grupos de 4 dígitos

  formatCardNumber(event: any): void {
    let input = event.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    let formattedInput = '';
    
    for (let i = 0; i < input.length; i++) {
      if (i > 0 && i % 4 === 0) {
        formattedInput += ' ';
      }
      formattedInput += input[i];
    }
    
    this.creditCardForm.patchValue({
      cardNumber: formattedInput
    });
  }

  validateCardHolder(event: any): void {
    const input = event.target.value;
    const cleaned = input.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, '');
    
    if (cleaned !== input) {
      this.creditCardForm.patchValue({
        cardHolder: cleaned
      });
    }
  }

  validateNumberInput(event: any): void {
    const input = event.target.value;
    const cleaned = input.replace(/[^0-9]/g, '');
    
    if (cleaned !== input) {
      event.target.value = cleaned;
      this.creditCardForm.patchValue({
        cvv: cleaned
      });
    }
  }

  formatExpiryDate(event: any): void {
    let input = event.target.value.replace(/[^0-9]/g, '');
    
    if (input.length >= 2) {
      input = input.substring(0, 2) + '/' + input.substring(2, 4);
    }
    
    this.creditCardForm.patchValue({
      expiryDate: input
    });
  }

  onCreditCardSubmit(): void {
    if (this.creditCardForm.valid && this.donationForm.valid) {
      this.processCreditCardPayment();
    } else {
      this.markFormGroupTouched(this.creditCardForm);
      this.markFormGroupTouched(this.donationForm);
    }
  }

  onPayPalSubmit(): void {
    if (this.paypalForm.valid && this.donationForm.valid) {
      this.processPayPalPayment();
    } else {
      this.markFormGroupTouched(this.paypalForm);
      this.markFormGroupTouched(this.donationForm);
    }
  }

  // Procesamiento de un pago con tarjeta de crédito y PayPal

  private processCreditCardPayment(): void {
    this.loading = true;

    //Procesamiento de un pago con tarjeta de crédito

    setTimeout(() => {
      this.finalizeDonation('TARJETA_CREDITO', `TRX-${Date.now()}`);
      this.loading = false;
    }, 2000);
  }

  // Procesamiento de un pago con PayPal

  private processPayPalPayment(): void {
    this.loading = true;
    
    setTimeout(() => {
      this.finalizeDonation('PAYPAL', `PP-${Date.now()}`);
      this.loading = false;
    }, 2000);
  }

  // Finaliza el proceso de donación enviando datos al backend
  // Construye el objeto de donación con toda la información necesaria
  // y lo envía al servicio para ser persistido en la base de datos.

  private finalizeDonation(metodoPago: string, referencia: string): void {
    if (!this.currentUser) {
      console.error('No se pudo obtener el usuario actual');
      alert('Error: No se pudo identificar al usuario. Por favor, inicie sesión nuevamente.');
      return;
    }

    console.log('Usuario actual para donación:', this.currentUser);

    // Crear la donación con el objeto organización completo

    const donation: any = {
      organizacion: {
        nit: this.organization.nit,
        nombre: this.organization.nombre
      },
      usuario: {
        id: this.currentUser.id,
        nombre: this.currentUser.nombre,
        correo: this.currentUser.correo
      },
      monto: this.donationForm.value.amount,
      metodoPago: metodoPago,
      referenciaPago: referencia,
      estado: 'COMPLETADO'
    };

    console.log('Enviando donación al servidor:', donation);

    this.donationService.registrarDonacion(donation).subscribe({
      next: (response) => {
        console.log('Donación registrada exitosamente:', response);
        this.donationSuccess.emit();
      },
      error: (error) => {
        console.error('Error detallado registrando donación:', error);

        // Mostrar mensaje de error más específico
        
        if (error.status === 500) {
          alert('Error del servidor: No se pudo registrar la donación. Por favor, contacte al administrador.');
        } else if (error.status === 400) {
          alert('Error en los datos: Verifique la información de la donación.');
        } else {
          alert('Error al registrar la donación. El pago se procesó pero hubo un error en el sistema.');
        }
      }
    });
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }

  onCancel(): void {
    this.cancel.emit();
  }

  selectFictitiousCard(card: any): void {
    this.creditCardForm.patchValue({
      cardNumber: card.number,
      cardHolder: card.holder,
      expiryDate: this.generateFutureExpiryDate()
    });
  }

  selectFictitiousPayPal(account: any): void {
    this.paypalForm.patchValue({
      email: account.email,
      password: account.password
    });
  }
}