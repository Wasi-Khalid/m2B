import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';
import { OrderListService } from '../services/order-list.service';
import { firebase } from '@firebase/app';
import { SupplierOrderListService } from '../services/supplier-order-list-service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-my-order-list',
  templateUrl: './my-order-list.component.html',
  styleUrls: ['./my-order-list.component.css']
})
export class MyOrderListComponent implements OnInit {
  clicked: any;
  orderList: any;
  myOrdersInfo = [];
  error = false;
  localStorageData: any;
  subOrder = [];
  count = 0;
  urls = [
    { name: 'DHL', head: 'http://www.dhl.com.pk/en/express/tracking.html?AWB=', tail: '&brand=DHL' },
    { name: 'UPS', head: 'https://www.ups.com/track?loc=en_US&requester=ST/', tail: '' },
    { name: 'USPS', head: 'https://tools.usps.com/go/TrackConfirmAction?tRef=fullpage&tLc=4&text28777=&tLabels=', tail: '%2C' }
  ]

  constructor(private router: Router, private supplierOrderListService: SupplierOrderListService, private orderListService: OrderListService) {

  }

  ngOnInit() {
    this.localStorageData = JSON.parse(localStorage.getItem("user"));

    this.getOrderList();
  }
  setUrl(trackNo, cInfo) {
    let url = this.urls[cInfo - 1].head + trackNo + this.urls[cInfo - 1].tail;

    window.open(url);
  }
  onContact(id) {

    this.router.navigateByUrl('/chat/messages?userId=' + id);
  }
  getOrderList() {
    // Use snapshotChanges().map() to store the key
    this.orderListService.getOrderLists().snapshotChanges()
      .pipe(
        map(changes =>
          changes.map(c => ({ key: c.payload.key, ...c.payload.val() }))
        )
      )
      .subscribe(orderList => {
        this.myOrdersInfo = orderList;
      });
    console.log(this.myOrdersInfo);
    
  }


}
