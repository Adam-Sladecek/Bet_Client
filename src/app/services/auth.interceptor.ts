import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { AuthService } from './auth.service';
import { Observable, throwError, from } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    constructor(private authService: AuthService) {}

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (this.shouldExclude(request)) {
            return next.handle(request);
        }
        const token = localStorage.getItem('access_token');
        request = request.clone({
            setHeaders: {
            Authorization: `Bearer ${token}`
            }
        });
        return next.handle(request).pipe(
            catchError(error => {
                if (error.status === 401) {
                    return from(this.authService.refreshToken()).pipe(
                        switchMap(() => {
                        const newToken = localStorage.getItem('access_token');
                        if (newToken) {
                            const clonedRequest = request.clone({
                            setHeaders: {
                                Authorization: `Bearer ${newToken}`
                            }
                            });
                            return next.handle(clonedRequest);
                        } else {
                            this.authService.logout();
                            return throwError(() => new Error('Failed to refresh token.'));
                        }
                        }),
                        catchError(refreshError => {
                        this.authService.logout();
                        return throwError(() => refreshError);
                        })
                    );
                } else {
                    return throwError(() => error);
                }
            })
        );
    }

    private shouldExclude(request: HttpRequest<any>): boolean {
        const excludedUrls = ['/api/token/refresh/', '/api/token/'];
        return excludedUrls.some(url => request.url.includes(url));
    }
}