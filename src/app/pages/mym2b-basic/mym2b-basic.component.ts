import { ToastrService } from 'ngx-toastr';
import { Component, OnInit, ViewChild } from '@angular/core';
import { map } from 'rxjs/operators';
import { SupplierService } from '../../services/supplier.service';
// import { HttpClient } from 'selenium-webdriver/http';
import { Http } from '@angular/http';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { OrderListService } from '../../services/order-list.service';



@Component({
  selector: 'app-mym2b-basic',
  templateUrl: './mym2b-basic.component.html',
  styleUrls: ['./mym2b-basic.component.css']
})
export class Mym2bBasicComponent implements OnInit {
  toastRef: any;
  checkChild = "email";
  ownEmail: string;
  credit: number;
  users: any;
  purchases = 0;
  buy_back: any;

  constructor(private toastrService: ToastrService, private orderListService: OrderListService, private supplierSer: SupplierService, private fb: FormBuilder,private actRoute: ActivatedRoute, ) {
    this.buy_back = 0;
    this.buy_back = this.actRoute.snapshot.queryParamMap.get('buy_back');
    console.log(this.buy_back);

    this.supplierSer.needCredit = 0;
  }
localStorageData : any;
  ngOnInit() {
    this.ownEmail = JSON.parse(localStorage.getItem("user")).email;
    this.localStorageData = JSON.parse(localStorage.getItem("user"));
    this.uid = localStorage.getItem('login');
    this.getUsersList();
    this.getOrderList();

  }


  getUsersList() {

    this.supplierSer.getUsersByOption(this.checkChild, this.ownEmail).snapshotChanges().pipe(
      map(changes =>
        changes.map(c => ({ key: c.payload.key, ...c.payload.val() }))
      )
    ).subscribe(users => {
      users.forEach(user => {
        this.users = user;
        this.credit = this.users.credit;
      })
    });

  }
  pmethod(id)
  {
    if(id == 'ccard')
    {
      return 'Credit card';
    }
    else if(id == 'credit') 
    {
      return 'M2b Credit';
    }
  }
  myOrdersInfo : any;
  uid : any;

  getOrderList() {
    // Use snapshotChanges().map() to store the key
    // alert(this.uid);
    this.purchases = 0;
    this.orderListService.getOrderLists().snapshotChanges()
      .pipe(
        map(changes =>
          changes.map(c => ({ key: c.payload.key, ...c.payload.val() }))
        )
      )
      .subscribe(orderList => {
        let or = [];
        orderList.forEach((currentValue, index) => {
            if(currentValue['uid'] == this.uid)
            {
              this.purchases++;
              or.push(currentValue);
            }
        });
        or.reverse();
        this.myOrdersInfo = or;
        console.log("myOrdersInfo");
    console.log(or);
      });

    
  }


}
