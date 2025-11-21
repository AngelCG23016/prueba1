import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Auth0IntegrationService } from './services/auth0.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  private auth0Service = inject(Auth0IntegrationService);

  // Inicializa la suscripcion al observable de autenticacion

  ngOnInit() {
    this.auth0Service.user$.subscribe();
  }
}