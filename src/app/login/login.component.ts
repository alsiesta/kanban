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

  constructor(private http:HttpClient, private auth: AuthService, private router: Router) {}

  async login () {
    try {
      let response:any = await this.auth.loginWithUsernameAndPassword(this.username, this.password);
      console.log(response);
      localStorage.setItem('token', response.token);
      localStorage.setItem('user_id', response.user_id);
      this.router.navigate(['/posts']);
      
    } catch (error) {
      alert('Login failed');
      console.error('Error:', error);
    }

  }


  ngOnInit(): void {}
}
