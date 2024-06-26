import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ChangeDetectorRef } from '@angular/core';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  isLoggingIn: boolean = true;
  isSigningUp: boolean = false;
  email: string = '';
  passwordRepeat: string = '';
  signupForm: FormGroup;
  errorMessage: string ='';

  constructor (private auth: AuthService, private router: Router, private fb: FormBuilder, private cd: ChangeDetectorRef) {
    this.signupForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(4)]],
      email: ['', [Validators.required, Validators.email]],
      passwordRepeat: ['', [Validators.required]]
    });
  }

  async login () {
    try {
      const response: any = await this.auth.loginWithToken(this.username, this.password);
      console.log('Response:', response);


      const user = {
        token: response.token,
        user_id: response.user_id,
        username: this.username,
        first_name: response.first_name,
        last_name: response.last_name,
        email: response.email,
        usertype: response.user_type,
      };

      console.log('User:', user);

      localStorage.setItem('user', JSON.stringify(user));
   

      this.router.navigateByUrl(this.auth.redirectUrl || '/kanban');
      console.log('Redirect URL:', this.auth.redirectUrl);
      this.auth.redirectUrl = ''; // Clear the stored URL
      
    } catch (error) {
      alert('Login failed');
      console.error('Error:', error);
    }

  }

  public switchState(event: Event) {
    event.preventDefault();
    this.isLoggingIn = !this.isLoggingIn;
    this.isSigningUp = !this.isSigningUp;
  }


  async signup () {
    if (this.signupForm.invalid) {
      this.errorMessage = 'Please fill out all fields correctly';
      return;
    }
    try {
      const response: any = await this.auth.signUp(this.username, this.password, this.email);
      console.log('Following User was created: ', response);

      this.isLoggingIn = !this.isLoggingIn;
      this.isSigningUp = !this.isSigningUp;
      
    } catch (error: any) {
      console.error('Error:', error);
      if (Array.isArray(error)) {
        this.errorMessage = error[0];
      } else {
        this.cd.detectChanges(); // Trigger change detection
        if (error.username) {
          this.errorMessage = error.username[0] + ' ' + 'And don\'t use whitespaces!';
        } else if (error.email) {
          this.errorMessage = error.email[0] + ' ' + 'Invalid email!';
        } else {
          this.errorMessage = 'An error occurred during sign up';
        }
      }
    }
  }

  ngOnInit(): void {}
}
