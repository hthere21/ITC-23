import { Component, OnInit,  ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { io } from 'socket.io-client';
import { ChatService } from '../chat.service';



@Component({
 selector: 'app-chat',
 templateUrl: './chat.component.html',
 styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
 @ViewChild('chatBody') chatBody!: ElementRef;
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


 constructor(private route: ActivatedRoute, private http: HttpClient, private chatService: ChatService) { }


 ngOnInit(): void {
  this.socket = io('http://localhost:3000', {
    transports: ['websocket']
  });
  const separator = '_';
  this.sender = this.route.snapshot.paramMap.get('userInfo.name') ?? '';
  this.receiver = this.route.snapshot.paramMap.get('userId.name') ?? '';
  this.receiver_id = this.route.snapshot.paramMap.get('userId._id') ?? '';
  this.sender_id = this.route.snapshot.paramMap.get('userInfo._id') ?? '';
  this.roomId = [this.receiver_id, this.sender_id].sort().join(separator);

  this.chatService.getStorage(this.roomId).subscribe(storageArray => {
    const storeIndex = storageArray.findIndex((storage: any) => storage.roomId === this.roomId);
    if (storeIndex !== -1) {
      this.messageArray = storageArray[storeIndex].chats;
      console.log(this.messageArray);
    }
    console.log(this.roomId);
    this.http.get<any[]>(`http://localhost:3000/chat?roomId=${this.roomId}`).subscribe(
      (data) => {
        const object = data;
        if (object && object.length > 0 && object[0].message) {
          this.messageArray = object[0].message;
          console.log(this.messageArray);
        } else {
          // If no chat exists, create a new one and save it to the collection
          const requestBody = {
            roomId: this.roomId,
            userId: this.sender_id,
            partnerId: this.receiver_id,
            message: []
          };
          this.http.post<any>('http://localhost:3000/chat', requestBody).subscribe(
            (data) => {
              // Update the message array with the newly created chat room's message array
              this.messageArray = data.message;
              // Reload the current page
              location.reload();
            },
            (error) => {
              console.log(error);
            }
          );          
        }        
      },
      (error) => {
        console.log(error);
      }
    );
  });
  setTimeout(() => {
    this.scrollToBottom();
  }, 100);
}

scrollToBottom() {
  const chatBody = this.chatBody.nativeElement;
  chatBody.scrollTop = chatBody.scrollHeight;
}

onKeyUp(event: KeyboardEvent) {
  if (event.keyCode === 13) {
    this.sendMessage();
  }
}

sendMessage(): void {
  this.chatService.getStorage(this.roomId).subscribe((storageArray) => {
    console.log(storageArray);
    const storeIndex = storageArray.findIndex((storage: { roomId: any; }) => storage.roomId === this.roomId);

    if (storeIndex > -1) {
      if (storageArray[storeIndex].chats) {
        storageArray[storeIndex].chats.push({
          user: this.receiver,
          message: this.messageText
        });
      } else {
        storageArray[storeIndex].chats = [{
          user: this.receiver,
          message: this.messageText
        }];
      }
    } else {
      const updateStorage = {
        roomId: this.roomId,
        chats: [{
          user: this.receiver,
          message: this.messageText
        }]
      };
      storageArray.push(updateStorage);
      
    }    

    // store the message in a variable
    const newMessage = this.sender + ': ' + this.messageText;

    // update messageArray with new message
    this.messageArray.push({
      user: this.sender,
      message: newMessage // use the newMessage variable here
    });

    this.chatService.setStorage(this.roomId, newMessage);
    console.log(this.sender);
    this.messageText = '';

    this.http.get<any[]>(`http://localhost:3000/chat?roomId=${this.roomId}`).subscribe(
      (data) => {
        const object = data;
        this.messageArray = object[0].message;
        console.log(this.messageArray);

        // update messageArray with new message
        this.messageArray.push({
          user: this.sender,
          message: newMessage
        });

        // emit the message to the server
        this.socket.emit('new message', {
          user: this.sender,
          partner: this.receiver,
          room: this.roomId,
          message: this.messageText // use the messageText variable here
        });
        console.log(this.messageText);
        // call scrollToBottom after emitting the message
        this.scrollToBottom();
      },
      (error) => {
        console.log(error);
      }
    );
  });
}
}



