import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-saved-list',
  templateUrl: './saved-list.component.html',
  styleUrls: ['./saved-list.component.css']
})
export class SavedListComponent implements OnInit {
  savedUsers: any = [];
  userInfo: any;

  constructor(private http: HttpClient, private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.http.get<any>('http://localhost:3000/get-save-user').subscribe(
      (response) => {
        this.savedUsers = response.savedUsers;
      },
      (error) => {
        console.error(error);
      }
    );

    this.http.get<any[]>('http://localhost:3000/get-user', {}).subscribe(
      (data) => {
        this.userInfo = data;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  removeUser(user: any) {
    const index = this.savedUsers.indexOf(user);
  
    if (index !== -1) {
      this.savedUsers.splice(index, 1);
  
      this.http.post<any>(`http://localhost:3000/remove-user`, { savedUserId: user._id }).subscribe(
        (response) => {
          console.log(response);
          //this.savedUsers = response.savedUsers;
        },
        (error) => {
          console.error(error);
        }
      );
    }
  }  
  
  startChat(userInfo: any, userId: any) {
    this.router.navigate(['/chat', userInfo.name, userId.name, userInfo._id, userId._id]);
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
}
