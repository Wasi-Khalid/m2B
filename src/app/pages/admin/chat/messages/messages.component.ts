import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { map } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en';
import { useAnimation } from '@angular/animations';
import * as firebase from "firebase"

import { ChatMessageService } from '../../../../services/chat-message.service';
import { ChatMessageModel } from '../../../../models/chat-message.model';
import { AuthService } from '../../../../authentication/core/auth.service';
import { SupplierService } from '../../../../services/supplier.service';
import { SupplierOrderListService } from '../../../../services/supplier-order-list-service.service';
import { SupplierOrderListModel } from '../../../../models/supplier-order-list.model';
import { Role } from '../../../../models/user.model';

TimeAgo.addLocale(en);
@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class adminMessagesComponent implements OnInit {

  message = "";
  messageObj = new SupplierOrderListModel();
  messageObjAdmin = new ChatMessageModel();
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
  option: string;
  idName: string;
  userName: string;
  timeAgo = new TimeAgo('en-US');

  constructor(
    private supplierOrderListService: SupplierOrderListService,
    private fb: FormBuilder,
    private authService: AuthService,
    private chatMessageSer: ChatMessageService,
    private actRoute: ActivatedRoute,
    private supplierSer: SupplierService) {
    this.option = localStorage.getItem("op");



  }

  ngOnInit() {
    this.localStorageData = JSON.parse(localStorage.getItem("user"));
    this.ownEmail = this.localStorageData.email;
    this.actRoute.queryParams.subscribe(quer => {
      this.id = quer.userId ? quer.userId : quer.orderId;
      if (this.option == Role.Supplier) {
        this.idName = quer.userId ? 'userId' : 'orderId';
      } else {
        this.idName = 'userId';
      }

      console.log(this.id);
      this.getData();
    });


    this.getUserInfo();
    this.scrollToBottom();
  }
  ngAfterViewChecked() {
    this.scrollToBottom();
  }
  timeagos(time: any) {
    return this.timeAgo.format(time);
  }
  scrollToBottom(): void {
    try {
      this.msgContents.nativeElement.scrollTop = this.msgContents.nativeElement.scrollHeight;
    } catch (err) { }
  }
  send() {


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
        if (this.idName == 'orderId') {
          this.messageObj = this.chats;
          this.messageObj[0].userUnread++;
          this.messageObj[0].supplierUnread = 0;
          this.messageObj[0].lastAddedMsgDate = Date.now().toString();
          this.messageObj[0].messages.push(this.msgStruct);
          this.supplierOrderListService.updateOrderList(this.myMessages[0], this.messageObj[0]);
          this.messageObj = new SupplierOrderListModel();
        } else {
          this.messageObjAdmin = this.chats;
          if (this.option == Role.Supplier) {
            this.messageObjAdmin[0].userUnread++;
            this.messageObjAdmin[0].supplierUnread = 0;
          } else {
            this.messageObjAdmin[0].supplierUnread++;
            this.messageObjAdmin[0].userUnread = 0;
          }
          this.messageObjAdmin[0].lastAddedMsgDate = Date.now().toString();
          this.messageObjAdmin[0].messages.push(this.msgStruct);
          this.chatMessageSer.updatechatMessage(this.myMessages[0], this.messageObjAdmin[0]);
          this.messageObjAdmin = new ChatMessageModel();
        }
        console.log(this.messageObj);
        console.log(this.myMessages);



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

  getData() {

    if (this.idName == 'orderId') {
      this.supplierOrderListService.getOrderListsByOption("userOrderID", this.id).snapshotChanges().pipe(
        map(changes =>
          changes.map(c => ({ key: c.payload.key, ...c.payload.val() }))
        )
      ).subscribe(chat => {
        this.chats = chat;
        chat.forEach(chats => {
          this.myMessages.push(chats.key);
          this.userName = chats.userName;


        });
      });
    } else {
      this.chatMessageSer.getchatMessagesByOption('chatID', this.id).snapshotChanges().pipe(
        map(changes =>
          changes.map(c => ({ key: c.payload.key, ...c.payload.val() }))
        )
      ).subscribe(chat => {
        this.chats = chat;
        chat.forEach(chats => {
          this.myMessages.push(chats.key);

        });
      });
    }
    console.log(this.myMessages);
  }


  handleSubmit(event) {
    if (event.keyCode === 13) {
      this.send();
    }
  }
}




















