import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-user-page',
  templateUrl: './user-page.component.html',
  styleUrls: ['./user-page.component.css']
})
export class UserPageComponent implements OnInit {
  user: any;
  loading: boolean = true;
  userInfo: any;
  userId: any;

  constructor(private route: ActivatedRoute, private http: HttpClient, private authService: AuthService, private router: Router) { }

  ngOnInit() {
    this.loading = true;
    this.http.get<any[]>('http://localhost:3000/get-user', {}).subscribe(
      (data) => {
        console.log(data);
        this.user = data;
        this.loading = false;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  logout() {
    this.authService.logout().subscribe(
      (success) => {
        // handle success case
      },
      (error) => {
        // handle error case
      }
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
    }, 300); 
  }
}
