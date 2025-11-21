import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserRolesService } from '../../services/user-roles.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  private userRolesService = inject(UserRolesService);
  
  isAdmin$: Observable<boolean>;

  constructor() {

    // Inicializa el observable con el estado de permisos desde Auth0
    this.isAdmin$ = this.userRolesService.isAdmin();
  }
}