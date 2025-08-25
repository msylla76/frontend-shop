import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, switchMap, filter, take, timeout } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private isRefreshing = false;
  private refreshTokenSubject = new BehaviorSubject<boolean>(false);
  private waitingQueueCount = 0;
  private readonly MAX_QUEUE = 5;

  constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // 🔹 Exclure les endpoints d'auth pour éviter les boucles infinies
    if (req.url.includes('/auth/login') || req.url.includes('/auth/refresh-token')) {
      return next.handle(req);
    }

    const token = localStorage.getItem('accessToken');
    let authReq = req;

    if (token) {
      console.log("gggggg",token);
      authReq = req.clone({
        setHeaders: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${token}`
        },
        withCredentials: true
      });
    } else {
      authReq = req.clone({
        setHeaders: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
        withCredentials: true
      });
      console.log("jj",token);
    }

    return next.handle(authReq).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          if (this.waitingQueueCount >= this.MAX_QUEUE) {
            console.warn('Refresh token queue is full, rejecting request');
            return throwError(() => new Error('Too many simultaneous refresh token requests'));
          }

          this.waitingQueueCount++;

          if (!this.isRefreshing) {
            this.isRefreshing = true;
            this.refreshTokenSubject.next(false);

            return this.authService.revokeToken().pipe(
              timeout(5000),
              switchMap(() => {
                this.isRefreshing = false;
                this.refreshTokenSubject.next(true);
                this.waitingQueueCount = 0;

                const newToken = localStorage.getItem('accessToken');
                return next.handle(
                  req.clone({
                    setHeaders: newToken ? { Authorization: `Bearer ${newToken}` } : {},
                    withCredentials: true
                  })
                );
              }),
              catchError(refreshError => {
                this.isRefreshing = false;
                this.waitingQueueCount = 0;
                this.refreshTokenSubject.next(false);
                this.authService.logout();
                return throwError(() => refreshError);
              })
            );
          } else {
            return this.refreshTokenSubject.pipe(
              filter(success => success === true),
              take(1),
              switchMap(() => {
                this.waitingQueueCount--;
                const newToken = localStorage.getItem('accessToken');
                return next.handle(
                  req.clone({
                    setHeaders: newToken ? { Authorization: `Bearer ${newToken}` } : {},
                    withCredentials: true
                  })
                );
              })
            );
          }
        }
        return throwError(() => error);
      })
    );
  }
}