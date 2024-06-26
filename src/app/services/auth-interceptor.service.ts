import { Injectable } from '@angular/core';
import { HttpErrorResponse, HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable, throwError, catchError } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthInterceptorService implements HttpInterceptor{

  constructor(private router: Router, private authService: AuthService) { }

  intercept (request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // const token = localStorage.getItem('token');

    const userItem = localStorage.getItem('user');
    const user = userItem ? JSON.parse(userItem) : null;
    const token = user ? user.token : null;

    if (token) {
      request = request.clone({
        setHeaders: { Authorization: `Token ${token}` }
      });
    }

    return next.handle(request).pipe(catchError((err) => {
      if (err instanceof HttpErrorResponse) {
        if (err.status === 401) {
          this.authService.redirectUrl = this.router.url;
          console.log('Redirect URL:', this.authService.redirectUrl);
          this.router.navigateByUrl('/login');
        }
      }
      return throwError(() => err);
    }));
  }
}
