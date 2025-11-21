import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { routes } from './app.routes';
import { authInterceptor } from './interceptors/auth.interceptor'; 
import { AuthModule } from '@auth0/auth0-angular';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(
      withInterceptors([authInterceptor])
    ),

    // Configura la integración con Auth0 para autenticación y autorización
    // Define el dominio, client ID, audiencia y parámetros de autorización

    AuthModule.forRoot({
      domain: 'dev-hsanq3qm5ekjk2si.us.auth0.com', // Dominio de Auth0 
      clientId: 'PqtL40rWTeJchs0lkpz4i3zdUf5stxkE', // ID de cliente de Auth0
      authorizationParams: {
        redirect_uri: window.location.origin,
        audience: 'https://api.appoyar.com' // Audiencia para la API
      },
      cacheLocation: 'localstorage',
      useRefreshTokens: true
    }).providers!
  ]
};