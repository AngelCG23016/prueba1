import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';

export interface CreateUserRequest {
  nombre: string;
  correo: string;
  passwordHash: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api/usuarios';

  // Genera un nombre de usuario legible a partir de una direccion de email

  private generateUsernameFromEmail(email: string): string {
    const usernamePart = email.split('@')[0];
    
    const cleanName = usernamePart.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, '');
    
    if (cleanName && cleanName.length > 1) {
      return cleanName.charAt(0).toUpperCase() + cleanName.slice(1).toLowerCase();
    }
    
    return 'Usuario_' + Math.random().toString(36).substring(2, 8);
  }

  // Crea un nuevo usuario en la base de datos del backend

  createUser(userData: CreateUserRequest): Observable<User> {
    console.log('Enviando datos al backend:', userData);
    return this.http.post<User>(this.apiUrl, userData);
  }

  // Sincroniza un usuario de Auth0 con la base de datos del backend

  syncUserAfterAuth0(auth0User: any): Observable<User> {
    let nombre = '';
    
    if (auth0User.name && auth0User.name !== auth0User.email) {
      nombre = auth0User.name;
    } else if (auth0User.nickname && auth0User.nickname !== auth0User.email) {
      nombre = auth0User.nickname;
    } else {
      nombre = this.generateUsernameFromEmail(auth0User.email);
    }

    const userData: CreateUserRequest = {
      nombre: nombre,
      correo: auth0User.email,
      passwordHash: 'auth0_' + auth0User.sub
    };
    
    console.log('Sincronizando usuario con nombre:', nombre);
    return this.createUser(userData);
  }

  // Obtiene todos los usuarios registrados en el sistema

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl);
  }

  // Busca un usuario por su dirección de email

  getUserByEmail(email: string): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/correo/${email}`);
  }
}