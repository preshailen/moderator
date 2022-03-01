import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AlertService } from './alert.service';
import { AuthorizationService } from './auth.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private as: AlertService, private auService: AuthorizationService) {}
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
      return next.handle(req).pipe(
            catchError(error => {
            if (error instanceof HttpErrorResponse) {
                if (error.status === 401) {
                  this.auService.$loggedIn.next(false);
									localStorage.removeItem('eModAuthToken');
									localStorage.removeItem('eModEmail');
									this.as.errorThenNav('Session expired!', '/login');
                  return throwError(error.statusText);
                }
								if (error.status === 403) {
									this.auService.$role.next('Error');
									this.as.errorThenNav('Insufficient permissions!', '/permissions-error');
									return throwError(error.statusText);
								}
                const applicationError = error.headers.get('Application-Error');
                if (applicationError) {
                    return throwError(applicationError);
                }
                const serverError = error.error;
                let modalStateErrors = '';
                if (serverError && typeof serverError === 'object') {
                    for (const key in serverError) {
                        if (serverError[key]) {
                            modalStateErrors += serverError[key] + '\n';
                        }}}
                return throwError(modalStateErrors || serverError || 'Server Error');
            }
        }));
    }
}
export const ErrorInterceptorProvider = {
    provide: HTTP_INTERCEPTORS,
    useClass: ErrorInterceptor,
    multi: true
};

