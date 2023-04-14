import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, throwError, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { io, Socket } from 'socket.io-client';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private messagesUrl = 'http://localhost:3000/chat';
  private socket: Socket;

  constructor(private http: HttpClient) {
    this.socket = io('http://localhost:3000', {transports: ['websocket', 'polling', 'flashsocket']});
  }

  joinRoom(data: any): void {
    this.socket.emit('join', data);
    //console.log("Join: "+data.room);
  }

  sendMessage(data: any): void {
    this.socket.emit('message', data);
    //console.log("Message: "+ data.message);
  }

  getMessage(): Observable<any> {
    return new Observable<{message: string}>(observer => {
      this.socket.on('new message', (data) => {
        observer.next(data);
      });
  
      return () => {
        this.socket.disconnect();
      }
    }).pipe(
      catchError(error => {
        console.error(error);
        return of(null);
      })
    );
  }
  
  getStorage(roomId: string): Observable<any> {
    const options = { params: { roomId } };
    //console.log(roomId);
    return this.http.get<any>(this.messagesUrl, options).pipe(
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

  setStorage(roomId: any, sender:any, receiver:any, sender_id: any, receiver_id: any, message: any) {
    const body = {
      roomId: roomId,
      sendername: sender,
      receivername: receiver,
      sender_id: sender_id,
      receiver_id: receiver_id,
      message: message
    };
    //console.log(roomId + " message:"+ message);
    this.http.post(this.messagesUrl, body).subscribe(
      response => {
        console.log('Data saved successfully:', response);
      },
      error => {
        console.log('Error saving data:', error);
      }
    );

    this.socket.emit('new message', message);
  }
  
}
