import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Auth0IntegrationService } from '../../../services/auth0.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  private auth0Service = inject(Auth0IntegrationService);
  private router = inject(Router);

  // Inicia el proceso de login con Auth0

  login(): void {
    this.auth0Service.login();
  }

  // Inicia el proceso de registro con Auth0

  signup(): void {
    this.auth0Service.signup();
  }
}