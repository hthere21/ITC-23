import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-update-info',
  templateUrl: './update-info.component.html',
  styleUrls: ['./update-info.component.css']
})
export class UpdateInfoComponent {
  errorMessage: string = "";
  continue: Boolean = false;
  username ='';
  rentingZipcode = '';
  gender = '';
  university = '';
  major = '';
  picture = '';
  bio = '';
  age = '';
  sleep = '';
  guests = '';
  smoking = '';
  pets = '';
  lgbt = '';
  couples = '';
  budget = '';
  moveInDate = '';
  minLength = '';
  maxLength = '';
  amenities = {
    wifi: false,
    kitchen: false,
    parking: false
  };
  size = '';
  furnished = '';
  occupancy = '';

  constructor(private http: HttpClient, private router: Router, private authService: AuthService) {}

  update() {
    let bodyData = {
      "name": this.username,
      "zipcode": this.rentingZipcode,
      "gender": this.gender,
      "university": this.university,
      "major": this.major,
      "picture": this.picture,
      "bio": this.bio,
      "age": this.age,
      "sleep": this.sleep,
      "guests": this.guests,
      "smoking": this.smoking,
      "pets": this.pets,
      "lgbt": this.lgbt,
      "couples": this.couples,
      "budget": this.budget,
      "move_in_date": this.moveInDate,
      "min_length": this.minLength,
      "max_length": this.maxLength,
      "amenities": this.amenities,
      "size": this.size,
      "furnished": this.furnished,
      "occupancy": this.occupancy
    };
    this.http.put("http://localhost:3000/update-user",bodyData, {responseType: 'text'}).subscribe((resultData: any)=>
    {
      alert("Update Successfully");
      this.gender = '';
      this.university = '';
      this.major = '';
      this.picture = '';
      this.bio = '';
      this.age = '';
      this.sleep = '';
      this.guests = '';
      this.smoking = '';
      this.pets = '';
      this.lgbt = '';
      this.couples = '';
      this.budget = '';
      this.moveInDate = '';
      this.minLength = '';
      this.maxLength = '';
      this.amenities = {
        wifi: false,
        kitchen: false,
        parking: false
      };
      this.size = '';
      this.furnished = '';
      this.occupancy = '';
      this.router.navigate(['/user'])
    })
  }

  back() {
    this.router.navigate(['/user']);
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
