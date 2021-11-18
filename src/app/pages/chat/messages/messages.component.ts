import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { SupplierOrderListService } from '../../../services/supplier-order-list-service.service';
import { SupplierService } from '../../../services/supplier.service';
import { map } from 'rxjs/operators';
import { SupplierOrderListModel } from '../../../models/supplier-order-list.model';

TimeAgo.addLocale(en);
@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent
  implements OnInit {
  message = "";
  messageObj = new SupplierOrderListModel();
  msgStruct = {
    message: '',
    timeSent: '',
    senderId: '',
    senderEmail: ''
  };
  @ViewChild('scrollMe') private msgContents: ElementRef;
  myMessages = new Array();
  ownEmail: string;
  isOwnMessage: boolean;
  userEmail: string;
  messageContent: string;
  checkChild = "userOrderID";
  chats: any;
  id: any;
  userData = {
    nameCheck: '',
    key: ''
  }
  chatEmail: any;
  chatUid: string;
  chatName: string;
  localStorageData: any;
  timeAgo = new TimeAgo('en-US');
  constructor(private supplierOrderListService: SupplierOrderListService, private actRoute: ActivatedRoute, private supplierSer: SupplierService) {

  }


  ngOnInit() {
    this.localStorageData = JSON.parse(localStorage.getItem("user"));
    this.ownEmail = this.localStorageData.email;
    this.actRoute.queryParams.subscribe(quer => {
      this.id = quer.userId;
      console.log(this.id);
      this.getData();
    });
    this.getUserInfo();
    this.scrollToBottom();
  }
  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  send() {
    this.messageObj = this.chats;

    console.log(this.chats);
    if (this.message === "") {
      console.log("Empty Message!")
    } else {
      setTimeout(() => {
        this.msgStruct = {
          message: this.message, timeSent: Date.now().toString(), senderId: this.getUserInfo().key, senderEmail: this.ownEmail
        }
        console.log(this.msgStruct);
        console.log(this.myMessages);
        console.log(this.messageObj);

        this.messageObj[0].messages.push(this.msgStruct);
        this.messageObj[0].supplierUnread++;
        this.messageObj[0].userUnread = 0;
        this.messageObj[0].lastAddedMsgDate = Date.now().toString();
        console.log(this.messageObj);
        console.log(this.myMessages);


        this.supplierOrderListService.updateOrderList(this.myMessages[0], this.messageObj[0]);

        this.messageObj = new SupplierOrderListModel();
        this.message = "";
      }, 500);
    }
  }

  getUserInfo() {
    this.supplierSer.getUsersByOption("email", this.ownEmail).snapshotChanges().pipe(
      map(changes =>
        changes.map(c => ({ key: c.payload.key, ...c.payload.val() }))
      )
    ).subscribe(users => {
      users.forEach(user => {
        this.userData.key = user.key;
        this.userEmail = user.email;
        console.log(this.userData.key);
        this.userData.nameCheck = user.name;
        console.log(this.userData.nameCheck);
      })
    });
    return this.userData;
  }

  timeagos(time: any) {
    return this.timeAgo.format(time);
  }

  scrollToBottom(): void {
    try {
      this.msgContents.nativeElement.scrollTop = this.msgContents.nativeElement.scrollHeight;
    } catch (err) { }
  }
  getData() {
    this.supplierOrderListService.getOrderListsByOption(this.checkChild, this.id).snapshotChanges().pipe(
      map(changes =>
        changes.map(c => ({ key: c.payload.key, ...c.payload.val() }))
      )
    ).subscribe(chat => {

      this.chats = chat;
      console.log(this.chats);
      chat.forEach(item => {
        this.myMessages.push(item.key);

      });
      console.log(this.myMessages);
    });

  }
  handleSubmit(event) {
    if (event.keyCode === 13) {
      this.send();
    }
  }

}

