import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';
import { SupplierOrderListService } from '../../../services/supplier-order-list-service.service';
import { SupplierService } from '../../../services/supplier.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-supplier-cashout',
  templateUrl: './supplier-cashout.component.html',
  styleUrls: ['./supplier-cashout.component.css']
})
export class SupplierCashoutComponent implements OnInit {

  supplierOrderList = new Array();
  orderSelected = [];
  checkChild = "email";
  ownEmail: string;
  user: any;
  credit = 0;
  realCredit = 0;
  requestedSupplierOrderList = [];

  constructor(private router: Router,
    private toastrService: ToastrService,
    private supplierOrderListService: SupplierOrderListService,
    private supplierService: SupplierService) { }

  ngOnInit() {
    this.ownEmail = JSON.parse(localStorage.getItem("user")).email;
    this.getUserOption();
    this.getOrderList();
  }



  getOrderList() {
    this.supplierOrderList = [];
    this.requestedSupplierOrderList = [];
    this.supplierOrderListService.getOrderLists().snapshotChanges()
      .pipe(
        map(changes =>
          changes.map(c => ({ key: c.payload.key, ...c.payload.val() }))
        )
      )
      .subscribe(supplierOrderList => {
        this.realCredit = 0;
        this.requestedSupplierOrderList = [];
        this.supplierOrderList = [];
        supplierOrderList.forEach(order => {
          if (this.ownEmail == order.supplierEmail) {
            console.log(order);

            if (order.requested == "0") {
              this.realCredit += order.totalPrice;
              this.supplierOrderList.push(order);
            } else {
              this.requestedSupplierOrderList.push(order);
            }

          }
        })
        console.log(this.realCredit);

      });

  }
  getUserOption() {

    this.supplierService.getUsersByOption(this.checkChild, this.ownEmail).snapshotChanges().pipe(
      map(changes =>
        changes.map(c => ({ key: c.payload.key, ...c.payload.val() }))
      )
    ).subscribe(user => {
      this.user = user[0];


    });

  }
  addOrder(order) {
    let index = 0;
    index = this.supplierOrderList.findIndex(x => x.userOrderID === order.userOrderID);
    if (index == -1) {
      this.toastrService.info(' Cannot find order, Something went wrong!');
    } else {
      this.orderSelected.push(this.supplierOrderList[index]);
      this.supplierOrderList.splice(index, 1);
    }
  }
  removeOrder(order) {
    let index = 0;
    index = this.orderSelected.findIndex(x => x.userOrderID === order.userOrderID);
    if (index == -1) {
      this.toastrService.info(' Cannot find order, Something went wrong!');
    } else {
      this.supplierOrderList.push(this.orderSelected[index]);
      this.orderSelected.splice(index, 1);
    }
  }
  onCashout() {

    if (this.orderSelected.length > 0) {
      console.log(this.orderSelected);
      console.log(this.supplierOrderList);
      localStorage.setItem('orderCheckout', JSON.stringify(this.orderSelected));
      this.router.navigate(['/supplierCashoutFinal']);
    } else {
      this.toastrService.info('Order Not Selected!');
    }

  }
}
