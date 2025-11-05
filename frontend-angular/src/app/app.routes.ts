import { Routes } from '@angular/router';
import { WelcomeComponent } from './components/welcome/welcome.component';
import { MainPanelComponent } from './components/main-panel/main-panel.component';
import { LoginComponent } from './components/authentication/login/login.component';
import { ProfileComponent } from './components/authentication/profile/profile.component';
import { AuthCallbackComponent } from './components/authentication/auth-callback/auth-callback.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { OrganizationListComponent } from './components/organizations/organization-list/organization-list.component';
import { OrganizationDetailComponent } from './components/organizations/organization-detail/organization-detail.component';
import { OrganizationFormComponent } from './components/organizations/organization-form/organization-form.component';

// 👇 importar la tienda
import { StoreListComponent } from './components/store/store-list.component';

export const routes: Routes = [
  { path: '', component: WelcomeComponent },
  { 
    path: 'auth', 
    children: [
      { path: 'acceso', component: LoginComponent },
      { path: 'callback', component: AuthCallbackComponent },
      { path: '', redirectTo: 'acceso', pathMatch: 'full' }
    ]
  },
  { 
    path: 'panel', 
    component: MainPanelComponent,
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'organizations', component: OrganizationListComponent },
      { path: 'organizations/new', component: OrganizationFormComponent },
      { path: 'organizations/:nit', component: OrganizationDetailComponent },
      { path: 'organizations/edit/:nit', component: OrganizationFormComponent },

      // Tienda
      { path: 'tienda', component: StoreListComponent },

      { path: 'perfil', component: ProfileComponent },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },
  { path: '**', redirectTo: '' }
];
