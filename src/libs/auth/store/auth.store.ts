import { signalStore, withState, withMethods, patchState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
// import { AuthState, authInitialState, initialUserValue } from '@libs/auth/model/auth.model';
import { inject } from '@angular/core';
import { AuthService } from '../service/auth.service';
import { exhaustMap, pipe, switchMap, tap, of } from 'rxjs';
import { tapResponse } from '@ngrx/operators';
import { Router } from '@angular/router';
import { User } from '@libs/core/models/user';
import { LoginUser, NewUser } from '@libs/core/models/auth';
import { setLoaded, withCallState } from '@libs/core/access/call-state.feature';
import { FormErrorsStore } from '@libs/core/forms/forms-errors.store';

// import jwtDecode from 'jwt-decode';
import { jwtDecode } from 'jwt-decode';

export interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  user: any | null;
  loggedIn: boolean;
}

interface JwtPayload {
  sub: string;
  entreprise: string | null;
  boutique: string | null;
  role: number | null;
  nom: string | null;
  prenom: string | null;
  authorities: string[];
  iat: number;
  exp: number;
}

const authInitialState: AuthState = {
  accessToken: null,
  refreshToken: null,
  user: null,
  loggedIn: false,
};

// ----------------------
// Decode helper
// ----------------------
function decodeToken(token: string | null): JwtPayload | null {
  if (!token) return null;
  try {
    return jwtDecode<JwtPayload>(token);
  } catch {
    return null;
  }
}

export const AuthStore = signalStore(
  { providedIn: 'root' },
  withState<AuthState>(authInitialState),
  withMethods(
    (store, formErrorsStore = inject(FormErrorsStore), authService = inject(AuthService), router = inject(Router)) => ({
      getUser: rxMethod<void>(
        pipe(
          switchMap(() => authService.user()),
          tap(({ user }) => patchState(store, { user, loggedIn: true, ...setLoaded('getUser') })),
        ),
      ),
      login: rxMethod<LoginUser>(
        pipe(
          exhaustMap((credentials) =>
            authService.login(credentials).pipe(
              tapResponse({
                next: ({ accessToken, refreshToken }) => {
                  const decoded = decodeToken(accessToken);
                  localStorage.removeItem('accessToken');
                  if (accessToken) localStorage.setItem('accessToken', accessToken);
                  if (refreshToken) localStorage.setItem('refreshToken', refreshToken);
                  if (decoded) {
                    patchState(store, {
                      accessToken,
                      refreshToken,
                      user: {
                        username: decoded.sub,
                        roles: decoded.authorities,
                        entreprise: decoded.entreprise,
                        boutique: decoded.boutique,
                        role: decoded.role,
                        nom: decoded.nom,
                        prenom: decoded.prenom,
                      },
                      loggedIn: true,
                    });
                  }
                  else{
                    const user = null;
                    patchState(store, {
                      accessToken,
                      refreshToken,
                      user,
                      loggedIn: false,
                    });
                  }
                  router.navigateByUrl('/');
                },
                // error: ({ error }) => formErrorsStore.setErrors(error.errors),
                error: ({ error }) => console.log(error),
              }),
            ),
          ),
        ),
      ),
      register: rxMethod<NewUser>(
        pipe(
          exhaustMap((newUserData) =>
            authService.register(newUserData).pipe(
              tapResponse({
                next: ({ user }) => {
                  patchState(store, { user, loggedIn: true });
                  router.navigateByUrl('/');
                },
                error: ({ error }) => formErrorsStore.setErrors(error.errors),
              }),
            ),
          ),
        ),
      ),
      updateUser: rxMethod<User>(
        pipe(
          exhaustMap((user) =>
            authService.update(user).pipe(
              tapResponse({
                next: ({ user }) => {
                  patchState(store, { user });
                  // router.navigate(['profile', user.username]);
                },
                error: ({ error }) => formErrorsStore.setErrors(error.errors),
              }),
            ),
          ),
        ),
      ),
      logout: rxMethod<void>(
        pipe(
          exhaustMap(() =>
            authService.logout().pipe(
              tapResponse({
                next: () => {
                  // patchState(store, { user: initialUserValue, loggedIn: false });
                  // patchState(store, { user: initialUserValue, loggedIn: false });
                  router.navigateByUrl('login');
                },
                error: ({ error }) => formErrorsStore.setErrors(error.errors),
              }),
            ),
          ),
        ),
      ),
    }),
  ),
  withCallState({ collection: 'getUser' }),
);
