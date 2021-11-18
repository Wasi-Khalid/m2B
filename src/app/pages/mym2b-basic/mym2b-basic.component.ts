import { ToastrService } from 'ngx-toastr';
import { Component, OnInit, ViewChild } from '@angular/core';
import { map } from 'rxjs/operators';
import { SupplierService } from '../../services/supplier.service';
// import { HttpClient } from 'selenium-webdriver/http';
import { Http } from '@angular/http';
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

  constructor(private toastrService: ToastrService, private orderListService: OrderListService, private supplierSer: SupplierService, private fb: FormBuilder, ) {

    this.supplierSer.needCredit = 0;
  }

  ngOnInit() {
    this.ownEmail = JSON.parse(localStorage.getItem("user")).email;
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

  getOrderList() {
    // Use snapshotChanges().map() to store the key

    this.orderListService.getOrderLists().snapshotChanges()
      .pipe(
        map(changes =>
          changes.map(c => ({ key: c.payload.key, ...c.payload.val() }))
        )
      )
      .subscribe(orderList => {
        this.purchases = 0;
        orderList.forEach(product => {

          if (product.userEmail == this.ownEmail) {

            this.purchases++;

          }
        });
      });

  }


}
