import { ApiService } from '@libs/core/http-client/api.service';
import { User, UserResponse } from '@libs/core/models/user';
import { Injectable, inject } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { LoginUser, LoginUserRequest, NewUserRequest, NewUser } from '@libs/core/models/auth';
import { jwtDecode } from 'jwt-decode';

export interface AuthResponse {
  accessToken: string | null;
  refreshToken: string | null;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly apiService = inject(ApiService);

  user(): Observable<UserResponse> {
    return this.apiService.get<UserResponse>('/user');
  }

  update(user: User): Observable<UserResponse> {
    return this.apiService.put('/user', { user });
  }

  // login(credentials: LoginUser): Observable<UserResponse> {
  login(credentials: LoginUser): Observable<AuthResponse> {
    // return this.apiService.post<UserResponse, LoginUserRequest>('/auth/login', { user: credentials });
    return this.apiService.post<AuthResponse, LoginUser>('/auth/login', credentials );
  }

  logout(): Observable<{ message: string }> {
    return this.apiService.post<{ message: string }, void>('/users/logout');
  }

  register(credentials: NewUser): Observable<UserResponse> {
    return this.apiService.post<UserResponse, NewUserRequest>('/users', { user: credentials });
  }

  getDecodedAccessToken(token: string): any {
    try {
      return jwtDecode(token);
    } catch (Error) {
      return null;
    }
  }

  // Méthode pour rafraîchir les tokens. Utilisée par l'intercepteur HTTP
  revokeToken(): Observable<any> {
    return this.apiService.post<any, any>('/auth/refresh-token', {})
      .pipe(
        tap(response => {
          // Les nouveaux tokens sont automatiquement stockés dans des cookies HTTP-only
          console.log('Tokens refreshed successfully');
        })
      );
  }
}
