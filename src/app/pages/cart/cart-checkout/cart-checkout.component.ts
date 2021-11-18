import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../../services/product.service';
import { map } from 'rxjs/operators';
import { OrderListModel } from '../../../models/order-list.model';
import { OrderListService } from '../../../services/order-list.service';
import { SupplierService } from '../../../services/supplier.service';

@Component({
  selector: 'app-cart-checkout',
  templateUrl: './cart-checkout.component.html',
  styleUrls: ['./cart-checkout.component.css']
})
export class CartCheckoutComponent implements OnInit {
  isAddedCheck = "isAdded";
  selectProduct: any;
  totalPrice = 0;
  totalQtPrice: number;
  selectedData = {};
  totalSelectedProduct = new Array();
  // i=0;
  totalSelectPrice = 0;
  orderList: any;
  totalSKUPrice: number;
  id: string;
  users = [];
  constructor(private supplierSer: SupplierService) {
    this.orderList = JSON.parse(localStorage.getItem('orderData2'));
    this.calculateTotal();
    this.getSuplliersInfo();
  }

  ngOnInit() {
    this.id = this.makeid();

  }
  makeid() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < 5; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
  }
  ontrackOrder() {
    localStorage.removeItem('orderData2');
  }

  getSuplliersInfo() {
    let sameProd = [];
    let uniqueEmailValues: string[];
    let unique = {};
    let prodTotal = 0;
    let supplierTotal = 0;
    let container = {
      productDetail: []
    }
    this.orderList.forEach((i) => {

      if (!unique[i.supplierEmail]) {
        unique[i.supplierEmail] = true;
      }
    });
    uniqueEmailValues = Object.keys(unique);
    console.log(uniqueEmailValues);
    uniqueEmailValues.forEach((email) => {
      this.getCurrentUserInfo(email);

    });


  }

  getCurrentUserInfo(email) {

    this.supplierSer.getUsersByOption("email", email).snapshotChanges().pipe(
      map(changes =>
        changes.map(c => ({ key: c.payload.key, ...c.payload.val() }))
      )
    ).subscribe(users => {
      this.users.push(users[0]);

    });
  }





  calculateTotal() {
    this.totalSelectPrice = 0;
    this.orderList.forEach(el => {
      el.productSKU.forEach(item => {
        this.totalSKUPrice = item.SKU_Price * +item.quantity;
        this.totalSelectPrice = Math.round((this.totalSelectPrice + this.totalSKUPrice) * 100) / 100;
      });

    });
  }

}
