import { Component, OnInit,  ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { io } from 'socket.io-client';
import { ChatService } from '../chat.service';



@Component({
 selector: 'app-chat',
 templateUrl: './chat.component.html',
 styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
@ViewChild('chatWindow', {static: true}) chatWindow!: ElementRef<any>;
 messageText: string = "";
 messageInput = '';
 sender: any;
 receiver: any;
 activeChatId: string = '';
 receiver_id: string = '';
 sender_id: string = '';
 private storageArray: any;
 socket: any;
 roomId: any;
 messageArray: any;
 chatHistory: any;
 userInfo: any


 constructor(private route: ActivatedRoute, private http: HttpClient, private chatService: ChatService, private router: Router) {}


 ngOnInit(): void {
  this.socket = io('http://localhost:3000', {transports: ['websocket']});
  const separator = '_';
  this.sender = this.route.snapshot.paramMap.get('userInfo.name') ?? '';
  this.receiver = this.route.snapshot.paramMap.get('userId.name') ?? '';
  this.receiver_id = this.route.snapshot.paramMap.get('userId._id') ?? '';
  this.sender_id = this.route.snapshot.paramMap.get('userInfo._id') ?? '';
  this.roomId = [this.receiver_id, this.sender_id].sort().join(separator);


    this.join(this.sender, this.roomId);

    this.chatService.getStorage(this.roomId).subscribe(storageArray => { 
      if (storageArray.length !== 0)
      {
      this.storageArray = storageArray;
      this.messageArray = this.storageArray[0].message;
      }
      else 
      {
        this.chatService.setStorage( this.roomId,this.sender, this.receiver, this.sender_id, this.receiver_id, {});
        window.location.reload();
      }
    });

    this.chatService.getMessage().subscribe((data: {message: string }) => {
      //console.log("Helloooooooo");
      if (this.roomId) {
        setTimeout(() => {
          this.chatService.getStorage(this.roomId).subscribe(storageArray => { 
            this.storageArray = storageArray;
            this.messageArray = this.storageArray[0].message;
          });
        }, 200);
      }
      setTimeout(() => {this.scrollToBottom();}, 200);
    });

    this.http.get<any[]>(`http://localhost:3000/chat-history/${this.sender_id}`).subscribe(
      (data) => {
        console.log(data);
        this.chatHistory = data;
      },
      (error) => {
        console.log(error);
      }
    );
    
    this.http.get<any[]>('http://localhost:3000/get-user', {}).subscribe(
      (data) => {
        this.userInfo = data;
      },
      (error) => {
        console.log(error);
      }
    );

    setTimeout(() => {
      this.scrollToBottom();
    }, 300);
}

ngAfterViewInit(): void {
  this.socket = io('http://localhost:3000', {transports: ['websocket']});
  const separator = '_';
  this.sender = this.route.snapshot.paramMap.get('userInfo.name') ?? '';
  this.receiver = this.route.snapshot.paramMap.get('userId.name') ?? '';
  this.receiver_id = this.route.snapshot.paramMap.get('userId._id') ?? '';
  this.sender_id = this.route.snapshot.paramMap.get('userInfo._id') ?? '';
  this.roomId = [this.receiver_id, this.sender_id].sort().join(separator);

  this.join(this.sender, this.roomId);
  this.chatService.getStorage(this.roomId).subscribe(storageArray => { 
    if (storageArray.length !== 0) {
      this.storageArray = storageArray;
      this.messageArray = this.storageArray[0].message;
    } else {
      this.chatService.setStorage( this.roomId,this.sender, this.receiver, this.sender_id, this.receiver_id, {});
      window.location.reload();
    }
  });

  this.chatService.getMessage().subscribe((data: {message: string }) => {
    if (this.roomId) {
      setTimeout(() => {
        this.chatService.getStorage(this.roomId).subscribe(storageArray => { 
          this.storageArray = storageArray;
          this.messageArray = this.storageArray[0].message;
        });
      }, 500);
    }
  });

  this.http.get<any[]>(`http://localhost:3000/chat-history/${this.sender_id}`).subscribe(
    (data) => {
      console.log(data);
      this.chatHistory = data;
    },
    (error) => {
      console.log(error);
    }
  );
  
  this.http.get<any[]>('http://localhost:3000/get-user', {}).subscribe(
    (data) => {
      this.userInfo = data;
    },
    (error) => {
      console.log(error);
    }
  );
  setTimeout(() => {
    this.scrollToBottom();
  }, 500);
}

onUserClick(name: string, userId: string) {
  // Navigate to the user detail page, passing the user ID as a parameter
  this.router.navigate(['/chat', this.userInfo.name, name, this.userInfo._id, userId]);
  setTimeout(() => {
    window.location.reload();
  }, 200);
}


join(username:string, roomId: string): void {
  this.chatService.joinRoom({user: username, room:roomId});
}

sendMessage(): void {
  this.chatService.sendMessage({
    room: this.roomId,
    message: [{
      user: this.sender,
      message: this.messageText
    }]
  });

  const updateStorage = {
    user: this.sender,
    message: this.messageText
};
  this.chatService.setStorage(this.roomId, this.sender, this.receiver, this.sender_id, this.receiver_id, updateStorage);
  setTimeout(() => {
    this.scrollToBottom();
  }, 500);
  this.messageText =''

}
scrollToBottom(): void {
  try {
    this.chatWindow.nativeElement.scrollTop = this.chatWindow.nativeElement.scrollHeight;
  } catch(err) { }
}
}



