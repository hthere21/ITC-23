import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  login: boolean = false;
  userInfo: any;
  userId: any;

  constructor(private authService: AuthService, private http: HttpClient, private router: Router) {
    this.login = this.authService.isAuthenticated();
  }

  ngOnInit() {

    this.login = this.authService.isAuthenticated();
  }

  logout() {
    this.authService.logout().subscribe(
      (success) => {},
      (error) => {}
    );
  }

  chat() {
    this.http.get<any[]>('http://localhost:3000/get-user', {}).subscribe(
      (data) => {
        this.userInfo = data;
      },
      (error) => {
        console.log(error);
      }
    );

    this.http.get<any[]>('http://localhost:3000/chatting', {}).subscribe(
      (data) => {
        this.userId = data;
      },
      (error) => {
        console.log(error);
      }
    );
    setTimeout(() => {
    if(this.userId != null)
    {
      this.router.navigate(['/chat', this.userInfo.name, this.userId.name, this.userInfo._id, this.userId._id]);
    }
    else{
      alert("Chat history is empty. Please chat with someone first!");
    }
    }, 500); 
  }
}
