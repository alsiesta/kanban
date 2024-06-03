import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { lastValueFrom, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  redirectUrl: string = '';
  isLoggedIn = false;

  constructor (private http: HttpClient) { }

  public loginWithToken (username: string, password: string) {
    const url = environment.baseUrl + '/login/';
    const body = {
      'username': username,
      'password': password
    };
    this.isLoggedIn = true;
    return lastValueFrom(this.http.post(url, body));
  }

  public signUp (username: string, password: string, email: string) {
    const url = environment.baseUrl + '/signup/';
    const body = {
      'username': username,
      'password': password,
      'email': email
    };
    return lastValueFrom(this.http.post(url, body).pipe(
      catchError(error => {
        alert(JSON.stringify(error.error ? error.error : error, null, 2));
        return throwError(error);
      })
    ));
  }


  public logout () {
    const url = environment.baseUrl + '/logout/';
    this.http.get(url).subscribe(() => {
      localStorage.removeItem('user');
      this.isLoggedIn = false;
      location.reload();
    }, error => {
      console.error('Logout failed:', error);
    });
  }
}

