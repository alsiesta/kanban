import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  username: string = '';
  password: string = '';

  constructor(private auth: AuthService, private router: Router) {}

  async login () {
    try {
      const response: any = await this.auth.loginWithUsernameAndPassword(this.username, this.password);
      console.log('Response:', response);
      // localStorage.setItem('token', response.token);
      // localStorage.setItem('user_id', response.user_id);
      // localStorage.setItem('username', this.username);
      // localStorage.setItem('first_name', response.first_name);
      // localStorage.setItem('last_name', response.last_name);
      // localStorage.setItem('email', response.email);

      const user = {
        token: response.token,
        user_id: response.user_id,
        username: this.username,
        first_name: response.first_name,
        last_name: response.last_name,
        email: response.email
      };

      localStorage.setItem('user', JSON.stringify(user));

      this.router.navigateByUrl(this.auth.redirectUrl || '/');
      this.auth.redirectUrl = ''; // Clear the stored URL
      
    } catch (error) {
      alert('Login failed');
      console.error('Error:', error);
    }

  }


  ngOnInit(): void {}
}
