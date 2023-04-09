import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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

  constructor(private route: ActivatedRoute, private http: HttpClient, private authService: AuthService) { }

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
}
