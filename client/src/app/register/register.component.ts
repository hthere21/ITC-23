import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  email = '';
  rentingZipcode ='';
  username = '';
  password = '';
  password2 = '';
  errorMessage: string = "";
  continue: Boolean = false;
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
  nextPage: boolean = false;

  constructor(private http: HttpClient, private router: Router) {}
  register() {
    let bodyData = {
      "email": this.email,
      "password": this.password,
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
    this.http.post("http://localhost:3000/user/create",bodyData, {responseType: 'text'}).subscribe((resultData: any)=>
    {
      alert("Registered Successfully");
      this.username = '';
      this.password = '';
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
      this.router.navigate(['/login'])
    })
  }

  checkUsername(name: string): Observable<boolean> {
    return this.http.get<boolean>(`http://localhost:3000/check?username=${name}`);
  }
  
  next() {
    if (this.email == "" || this.password == "" || this.password2 == "") {
      this.errorMessage = 'Please fill in all fields';
    } else if (this.password != this.password2) {
      this.errorMessage = 'Passwords do not match';
    } else {
      console.log(this.username);
      setTimeout(() => {
      this.checkUsername(this.username).subscribe((data: boolean) => {
        console.log(data);
        if (data) {
          this.errorMessage = 'Username already exists';
        } else {
          this.continue = true;
        }
      });
    }, 500); 
    }
  }
  

  back() {
    this.continue = false;
  }
}
