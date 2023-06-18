import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Location } from '@angular/common';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email: string = "";
  password: string = "";
  errorMessage: string = "";

  constructor(private router: Router, private http: HttpClient, private location: Location) { }

  login() {
    if(this.email == "" && this.password == "")
    {
      this.errorMessage = 'Please fill in your account';
    }
    else
    {
    this.http.post<any>('http://localhost:3000/user/login', { email: this.email, password: this.password }).subscribe(
      (data:any) => {
        if (data.status) {
          // Redirect to home page or dashboard
            this.router.navigate(['/home']);
            localStorage.setItem('name', data.name);
        
            setTimeout(() => {
              window.location.reload();
            }, 300); // reload after 1 second
        } else {
          console.log(data.status)
          this.errorMessage = data.message;
        }
      },
      error => {
        console.error(error);
        this.errorMessage = 'An error occurred while trying to log in. Please try again later.';
      }
    );
    }
  }
}
