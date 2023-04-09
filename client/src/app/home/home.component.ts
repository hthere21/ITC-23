import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  currentPage: number = 1;
  pageSize: number = 5;
  totalUsers: number = 0;
  totalPages: number = 0;
  searchTerm: string = '';
  userInfo: any;

  users: any[] = [];
  pagedUsers: any[] = [];
  loading: boolean = true;
  searchBool: boolean = false;
  noUsersFound: boolean = false;

  constructor(private http: HttpClient, private authService: AuthService, private router: Router) { }

  ngOnInit() {
    this.loading = true;
    this.http.get<any[]>('http://localhost:3000/user', {
      params: {
        page: this.currentPage.toString(),
        limit: this.pageSize.toString(),
      }
    }).subscribe(
      (data) => {
        this.users = data;
        this.totalUsers = data.length;
        this.totalPages = Math.ceil(this.users.length / this.pageSize);
        this.setPage(1);
        this.loading = false;
      },
      (error) => {
        console.log(error);
        this.loading = false;
      }
    );

    this.http.get<any[]>('http://localhost:3000/get-user', {}).subscribe(
      (data) => {

        this.userInfo = data;
        this.loading = false;
      },
      (error) => {
        console.log(error);
      }
    );
  }
  
  goToPage(n: number): void {
    this.currentPage = n;
    this.setPage(n);
  }
  
  onPrev(): void {
    this.currentPage--;
    this.setPage(this.currentPage);
  }
  
  onNext(): void {
    this.currentPage++;
    this.setPage(this.currentPage);
  }  
  
  get pages(): number[] {
    const totalPages = Math.ceil(this.totalUsers / this.pageSize);
    return Array(totalPages).fill(0).map((_, i) => i + 1);
  }
  
  setPage(page: number) {
    if (page < 1 || page > this.totalPages) {
      return; // invalid page number, do nothing
    }
  
    // calculate start and end index of users on the page
    const startIndex = (page - 1) * this.pageSize;
    const endIndex = Math.min(startIndex + this.pageSize - 1, this.totalUsers - 1);
  
    // update pagedUsers property with users on the page
    this.pagedUsers = this.users.slice(startIndex, endIndex + 1);
  
    // update current page number
    this.currentPage = page;
  }  

  search(): void {
    console.log(this.searchTerm);
    if(this.searchTerm == "")
    {
      this.http.get<any[]>('http://localhost:3000/user', {
      params: {
        page: this.currentPage.toString(),
        limit: this.pageSize.toString(),
      }
    }).subscribe(
      (data) => {
        this.users = data;
        this.totalUsers = data.length;
        this.totalPages = Math.ceil(this.users.length / this.pageSize);
        this.setPage(1);
        this.loading = false;
      },
      (error) => {
        console.log(error);
        this.loading = false;
      }
    );
    }
    else
    {
      const params = {
        page: this.currentPage.toString(),
        limit: this.pageSize.toString(),
        search: this.searchTerm // include the search term in the query parameters
      };
    
      this.http.get<any[]>('http://localhost:3000/search', { params }).subscribe(
        (data) => {
          this.users = data;
          this.totalUsers = data.length;
          this.totalPages = Math.ceil(this.users.length / this.pageSize);
          if (this.users.length === 0) {
            this.noUsersFound = true;
            this.totalPages = 1;
          }
          else
          {
            this.noUsersFound = false;
          }
          this.setPage(1);
          this.loading = false;
        },
        (error) => {
          console.log(error);
          this.loading = false;
        }
      );
    }
  }
  
  saveUser(userId: string): void {
    console.log(userId);
    this.http.post<any>('http://localhost:3000/save-user', { userId }).subscribe(
      (response) => {
        console.log(response);
        // handle success response
      },
      (error) => {
        console.error(error);
        // handle error response
      }
    );
  }  

  startChat(userInfo: any, userId: any) {
    this.router.navigate(['/chat', userInfo.name, userId.name, userInfo._id, userId._id]);
  }

  logout() {
    this.authService.logout().subscribe(
      (success) => {},
      (error) => {}
    );
  }
}