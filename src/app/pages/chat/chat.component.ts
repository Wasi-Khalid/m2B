import { Component, OnInit } from '@angular/core';
import { SupplierService } from '../../services/supplier.service';
import { SupplierOrderListService } from '../../services/supplier-order-list-service.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
  chats: any;
  userName: string = "okk";
  checkChild = "email";
  ownEmail: string;
  myChatList = [];
  supplier = [];
  constructor(
    private supplierOrderListService: SupplierOrderListService,
    private supplierService: SupplierService
  ) {
    this.ownEmail = JSON.parse(localStorage.getItem("user")).email;
    this.getChatList();
  }

  ngOnInit() {
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
        supplierOrderList.sort((a, b) => { return (+b.lastAddedMsgDate - +a.lastAddedMsgDate) })
        supplierOrderList.forEach(order => {
          if (this.ownEmail == order.userEmail) {
            this.myChatList.push(order);
          }
        })
        console.log(this.myChatList);
      });

  }
  onClick(key) {
    let index = this.myChatList.findIndex(x => x.key == key);
    this.myChatList[index].userUnread = 0;

    this.supplierOrderListService.updateOrderList(this.myChatList[index].key, this.myChatList[index]);
  }

}



