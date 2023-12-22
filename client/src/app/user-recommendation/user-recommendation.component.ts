import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-user-recommendation',
  templateUrl: './user-recommendation.component.html',
  styleUrls: ['./user-recommendation.component.css']
})
export class UserRecommendationComponent implements OnInit {
  users: any;
  pagedUsers: any[] = [];
  loading: boolean = true;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loading = true;

    this.http.get<any[]>('http://localhost:3000/recommend', {}).subscribe(
      (data) => {
        console.log(data);
        this.users = data;
        this.loading = false;
    
        // Now, you can safely use this.users here.
        console.log(this.users);
      },
      (error) => {
        console.log(error);
        this.loading = false;
      }
    );
    
    

    console.log(this.users);
  }
}
