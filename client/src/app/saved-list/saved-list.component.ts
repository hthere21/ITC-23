import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-saved-list',
  templateUrl: './saved-list.component.html',
  styleUrls: ['./saved-list.component.css']
})
export class SavedListComponent implements OnInit {
  savedUsers: any = [];

  constructor(private http: HttpClient, private authService: AuthService) {}

  ngOnInit() {
    this.http.get<any>('http://localhost:3000/get-save-user').subscribe(
      (response) => {
        console.log(response);
        this.savedUsers = response.savedUsers;
      },
      (error) => {
        console.error(error);
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
}
