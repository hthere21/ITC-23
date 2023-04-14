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

  checkAuthentication(): Observable<boolean> {
    const isAuthenticated$ = this.http.get<boolean>('http://localhost:3000/login-check', {}).pipe(
      tap((data) => {
        this.logIn = data as boolean;
      }),
      map((data) => Boolean(data)),
      defaultIfEmpty(false)
    );
    return isAuthenticated$;
  }
  
  isAuthenticated(): Observable<boolean> {
    return this.checkAuthentication().pipe(
      map((data) => Boolean(data))
    );
  }

  logout(): Observable<boolean> {
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
