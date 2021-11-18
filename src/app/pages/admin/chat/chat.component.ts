import { Component, OnInit } from '@angular/core';
import { ChatMessageService } from '../../../services/chat-message.service';
import { map } from 'rxjs/operators';
import { SupplierService } from '../../../services/supplier.service';
import { SupplierOrderListService } from '../../../services/supplier-order-list-service.service';
import { Role } from '../../../models/user.model';


@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class adminChatComponent implements OnInit {
  chats: any;
  userName: string = "okk";
  chatSelected = '';
  isFound = false;
  chatOption = [
    { name: "Select here", value: '' },
    { name: "Chat with admin", value: 'admin' },
    { name: "Chat with Customer", value: 'customer' }

  ];
  ownEmail: string;
  myChatList = [];
  chatAdmin: any;
  chatSupplier: any;
  option: string;
  // nameCheck: string ;
  constructor(
    private supplierOrderListService: SupplierOrderListService,
    private chatMessageSer: ChatMessageService,
    private supplierSer: SupplierService) {
    this.ownEmail = JSON.parse(localStorage.getItem("user")).email;
    this.option = localStorage.getItem("op");


  }

  ngOnInit() {
    if (this.option == Role.Admin) {
      this.getChatAdmin();
    } else {
      this.getChatList();
      this.getChatSupplier();
    }
  }
  getUserName(id: string) {
    this.supplierSer.GetUser(id).valueChanges().subscribe(data => {
      if (this.userName == "okk") {
        this.userName = data.name;
      }
      return this.userName;
    })
  }


  getChatList() {
    let count = 0;

    this.supplierOrderListService.getOrderLists().snapshotChanges()
      .pipe(
        map(changes =>
          changes.map(c => ({ key: c.payload.key, ...c.payload.val() }))
        )
      )
      .subscribe(supplierOrderList => {
        if (count > 0) {
          this.myChatList = [];
        }
        count++
        console.log(supplierOrderList);
        supplierOrderList.sort((a, b) => { return ((+b.lastAddedMsgDate? +b.lastAddedMsgDate :0 ) - (+a.lastAddedMsgDate? +a.lastAddedMsgDate :0)) });
        console.log(supplierOrderList);
        supplierOrderList.forEach(order => {
          if (this.ownEmail == order.supplierEmail) {
            this.myChatList.push(order);
          }
        })

        console.log(this.myChatList);
      });

  }

  onClick(key, name) {
    if (name == 'customer') {
      let index = this.myChatList.findIndex(x => x.key == key);
      this.myChatList[index].supplierUnread = 0;
      this.supplierOrderListService.updateOrderList(this.myChatList[index].key, this.myChatList[index]);
    } else if (name == 'supplier') {
      let index = this.chatSupplier.findIndex(x => x.key == key);
      this.chatSupplier[index].supplierUnread = 0;
      this.chatMessageSer.updatechatMessage(this.chatSupplier[index].key, this.chatSupplier[index]);
    } else if (name == 'admin') {
      let index = this.chatAdmin.findIndex(x => x.chatID == key);
      this.chatAdmin[index].userUnread = 0;
      this.chatMessageSer.updatechatMessage(this.chatAdmin[index].key, this.chatAdmin[index]);
    }

  }



  getChatAdmin() {

    //   // Use snapshotChanges().map() to store the key
    this.chatMessageSer.getchatMessages().snapshotChanges()
      .pipe(
        map(changes =>
          changes.map(c => ({ key: c.payload.key, ...c.payload.val() }))
        )
      )
      .subscribe(chats => {
        console.log(chats);
        chats.sort((a, b) => { return ((+b.lastAddedMsgDate? +b.lastAddedMsgDate :0 ) - (+a.lastAddedMsgDate? +a.lastAddedMsgDate :0)) });
        console.log(chats);
        this.chatAdmin = chats;
        console.log(this.chatAdmin); 

      });

  }

  getChatSupplier() {

    //   // Use snapshotChanges().map() to store the key
    this.chatMessageSer.getchatMessagesByOption("userEmail", this.ownEmail).snapshotChanges()
      .pipe(
        map(changes =>
          changes.map(c => ({ key: c.payload.key, ...c.payload.val() }))
        )
      )
      .subscribe(chats => {
        console.log(chats);
        chats.sort((a, b) => { return ((+b.lastAddedMsgDate? +b.lastAddedMsgDate :0 ) - (+a.lastAddedMsgDate? +a.lastAddedMsgDate :0)) });
        console.log(chats);
        this.chatSupplier = chats;
        console.log(this.chatSupplier);
      });

  }
}
