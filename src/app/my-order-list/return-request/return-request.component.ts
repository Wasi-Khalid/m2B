import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';
import { OrderListService } from '../../services/order-list.service';
import { ToastrService } from 'ngx-toastr';
import { ReturnRequestModel } from '../../models/return-request.model';
import { ReturnRequestService } from '../../services/return-request.service';

@Component({
  selector: 'app-return-request',
  templateUrl: './return-request.component.html',
  styleUrls: ['./return-request.component.css']
})
export class ReturnRequestComponent implements OnInit {

  productobj = new ReturnRequestModel();
  id: string;
  orderList = [];
  myOrdersInfo = [];
  user: any;
  constructor(
    private actRoute: ActivatedRoute,
    private toastrService: ToastrService,
    private returnRequestService: ReturnRequestService,
    private router: Router,
    private orderListService: OrderListService,

  ) {
    this.id = this.actRoute.snapshot.queryParamMap.get('userId');
    this.user = JSON.parse(localStorage.getItem("user"));
  }

  ngOnInit() {
    this.getOrderList();

  }
  getOrderList() {
    // Use snapshotChanges().map() to store the key
    console.log(this.id)
    this.orderListService.getOrderListsByOption("id", this.id).snapshotChanges()
      .pipe(
        map(changes =>
          changes.map(c => ({ key: c.payload.key, ...c.payload.val() }))
        )
      )
      .subscribe(order => {
        console.log(order)
        this.orderList = order;

      });
  }

  removeProduct(index) {
    this.orderList[0].productDetail.splice(index, 1);
  }
  removeSKU(i, x) {
    this.orderList[0].productDetail[i].productSKU.splice(x, 1);
  }
  makeid() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < 5; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
  }
  sendRequest() {
    let total = 0;
    let priceTotal = 0;
    delete this.orderList[0].key;
    this.productobj = this.orderList[0];

    this.createOrderForSuplliers();

    this.toastrService.success("Your Request is Send!");
    this.router.navigateByUrl('/myOrderList');

  }
  sendData(prod, email, total) {

    this.productobj.requestApprove = "0";
    this.productobj.totalPrice = total;
    this.productobj.productDetail = prod;
    this.productobj.supplierEmail = email;
    this.productobj.addOn = Date.now();
    this.productobj.userEmail = this.user.email;//
    this.productobj.userOrderID = this.makeid();

    this.returnRequestService.createReturnRequest(this.productobj);
  }

  createOrderForSuplliers() {
    let prod;
    let sameProd = [];
    let uniqueEmailValues: string[];
    let unique = {};
    let supplierTotal = 0;
    let prodTotal = 0;
    prod = this.orderList[0].productDetail;
    prod.forEach((i) => {

      if (!unique[i.supplierEmail]) {
        unique[i.supplierEmail] = true;
      }
    });
    uniqueEmailValues = Object.keys(unique);
    console.log(uniqueEmailValues);

    uniqueEmailValues.forEach((email) => {
      prod.forEach((x) => {

        if (x.supplierEmail == email) {
          sameProd.push(x);

          x.productSKU.forEach(el => {
            prodTotal = el.quantity * el.SKU_Price;
            supplierTotal = supplierTotal + prodTotal;
          });
        }



      })
      console.log(sameProd);
      console.log(email);

      this.sendData(sameProd, email, supplierTotal);
      prodTotal = 0;
      sameProd = [];
      supplierTotal = 0;
    })


  }


}
