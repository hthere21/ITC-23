import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { io, Socket } from 'socket.io-client';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private messagesUrl = 'http://localhost:3000/chat';
  private socket: Socket;
  //private activeChat: BehaviorSubject<string> = new BehaviorSubject<string>("");

  constructor(private http: HttpClient) {
    this.socket = io('http://localhost:3000', {transports: ['websocket', 'polling', 'flashsocket']});
    //this.socket = io('http://localhost:3000', { transports: ['websocket'] });

    // Add error handling for socket.io connection
    this.socket.on('connect_error', (error) => {
      console.log('Socket.IO Connection Error:', error);
    });
    
    console.log("Success");
  }

  joinRoom(data: any): void {
    this.socket.emit('join', data);
    console.log("Join room"+ data);
  }

  sendMessage(data: any): void {
    this.socket.emit('message', data);
    console.log("Message"+ data);
  }

  getMessage(): Observable<any> {
    return new Observable<{user: string, message: string}>(observer => {
      this.socket.on('new message', (data) => {
        observer.next(data);
      });

      return () => {
        this.socket.disconnect();
      }
    });
  }

  getStorage(): Observable<any> {
    return this.http.get<any>(this.messagesUrl).pipe(
      catchError(this.handleError)
    );
  }
  
  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    // Return an observable with a user-facing error message.
    return throwError(
      'Something bad happened; please try again later.');
  };

  setStorage(data: any) {
    this.http.post(this.messagesUrl, data).subscribe(
      response => {
        console.log('Data saved successfully:', response);
      },
      error => {
        console.log('Error saving data:', error);
      }
    );
  }
  
  
}
