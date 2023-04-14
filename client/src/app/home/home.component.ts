import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { AuthService } from '../auth.service';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
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

  users:any ;
  pagedUsers: any[] = [];
  loading: boolean = true;
  searchBool: boolean = false;
  noUsersFound: boolean = false;

  filterForm: FormGroup;
  //LOGO = require("./assets/user.jpg");
  
  constructor(private http: HttpClient, private authService: AuthService, private router: Router, private formBuilder: FormBuilder) {
    this.users = []; 
    this.filterForm = this.formBuilder.group({
      zipcode: [''],
      gender: [''],
      age: [''],
      sleep: [''],
      guests: [''],
      smoking: [''],
      pets: [''],
      budget: [''],
      move_in_date: [''],
      amenities: this.formBuilder.group({
        wifi: false,
        kitchen: false,
        parking: false
      }),
      size: ['']
    });
    
  }

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
      console.log(this.searchTerm);
      const params = {
        search: this.searchTerm // include the search term in the query parameters
      };
      this.http.get<any[]>('http://localhost:3000/search', { params }).subscribe(
        (data) => {
          console.log(data);
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


  onSubmit() {
    const filterData = this.filterForm?.value;
    const params = new HttpParams({ fromObject: filterData });
    console.log(filterData);
    this.http.get('http://localhost:3000/filter', { params })
      .subscribe((data) => {
        console.log(data);
        // Handle response data
        this.users = data;
        this.totalUsers = this.users.length;
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
      }, (err) => {
        console.error(err);
        // Handle error
      });
  }
  
  resetFilter() {
    // Reset the filter form
    this.filterForm.reset();
    // Get all the data
    this.http.get('http://localhost:3000/user')
      .subscribe((data) => {
        // Handle response data
        this.users = data;
        this.totalUsers = this.users.length;
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
      }, (err) => {
        console.error(err);
        // Handle error
      });
  }
  

  saveUser(userId: string): void {
    console.log(userId);
    this.http.post<any>('http://localhost:3000/save-user', { userId }).subscribe(
      (response) => {
        console.log(response);
      },
      (error) => {
        console.error(error);
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