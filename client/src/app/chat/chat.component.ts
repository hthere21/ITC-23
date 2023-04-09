import { Component, OnInit } from '@angular/core';
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
 messageArray: any[] = [];


 constructor(private route: ActivatedRoute, private http: HttpClient, private chatService: ChatService) { }


 ngOnInit(): void {
   const separator = '_';
   this.sender = this.route.snapshot.paramMap.get('userInfo.name') ?? '';
   this.receiver = this.route.snapshot.paramMap.get('userId.name') ?? '';
   this.sender = this.route.snapshot.paramMap.get('userInfo') ?? '';
   this.receiver_id = this.route.snapshot.paramMap.get('userId._id') ?? '';
   this.sender_id = this.route.snapshot.paramMap.get('userInfo._id') ?? '';
   this.roomId = [this.receiver_id, this.sender_id].sort().join(separator);
   console.log(this.roomId);

   this.chatService.getMessage()
   .subscribe((data: { user: string, room: string, message: string }) => {
     // this.messageArray.push(data);
     if (this.roomId) {
       setTimeout(() => {
         this.chatService.getStorage().subscribe(storageArray => {
           const storeIndex = storageArray.findIndex((storage: any) => storage.roomId === this.roomId);
           this.messageArray = storageArray[storeIndex].chats;
         });
       }, 500);
     }
   });
 
 }




//  selectUserHandler(phone: string): void {
//    this.selectedUser = this.userList.find(user => user.phone === phone);
//    this.roomId = this.selectedUser.roomId[this.currentUser.id];
//    this.messageArray = [];


//    this.storageArray = this.chatService.getStorage();
//    const storeIndex = this.storageArray
//      .findIndex((storage) => storage.roomId === this.roomId);


//    if (storeIndex > -1) {
//      this.messageArray = this.storageArray[storeIndex].chats;
//    }


//    this.join(this.currentUser.name, this.roomId);
//  }


 join(username: string, roomId: string): void {
   this.chatService.joinRoom({user: username, room: roomId});
 }


 sendMessage(): void {
  this.chatService.sendMessage({
    user: this.sender,
    room: this.roomId,
    message: this.messageText
  });

  this.chatService.getStorage().subscribe((storageArray) => {
    console.log(storageArray);
    const storeIndex = storageArray.findIndex((storage: { roomId: any; }) => storage.roomId === this.roomId);

    if (storeIndex > -1) {
      storageArray[storeIndex].chats.push({
        user: this.receiver,
        message: this.messageText
      });
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

    this.chatService.setStorage(storageArray);
    this.messageText = '';
  });
}

}
