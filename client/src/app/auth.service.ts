import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap, map, defaultIfEmpty, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  logIn: boolean = false;

  constructor(public http: HttpClient) { 
  }  

  
  isAuthenticated(): boolean {
    if(localStorage.getItem('name'))
    {
      return true;
    }
    else
    {
    return false;
    }
  }

  logout(): Observable<boolean> {
    localStorage.removeItem("name");
    return this.http.post('http://localhost:3000/logout', {}).pipe(
      tap(() => {
        console.log("Logout successful");
        this.logIn = false;
      }),
      map(() => true),
      catchError((error) => {
        console.error(error);
        return of(false);
      })
    );
  }
  
  
}
