import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';
import { OrderListService } from '../../services/order-list.service';
import { ToastrService } from 'ngx-toastr';
import { ReturnRequestModel } from '../../models/return-request.model';
import { ReturnRequestService } from '../../services/return-request.service';
import { AngularFireDatabase, AngularFireList, AngularFireObject } from 'angularfire2/database';

@Component({
  selector: 'app-return-request',
  templateUrl: './return-request.component.html',
  styleUrls: ['./return-request.component.css']
})
export class ReturnRequestComponent implements OnInit {

  productobj = new ReturnRequestModel();
  id: string;
  orderList : any;
  myOrdersInfo = [];
  user: any;
  constructor(
    private actRoute: ActivatedRoute,
    private toastrService: ToastrService,
    private returnRequestService: ReturnRequestService,
    private router: Router,
    private orderListService: OrderListService,
    private db: AngularFireDatabase
  ) {
    this.id = this.actRoute.snapshot.queryParamMap.get('userId');
    this.user = JSON.parse(localStorage.getItem("user"));
  }

  ngOnInit() {
    this.getOrderList();

  }
  updateqty(i,type)
  {
    console.log(type);
    console.log((this.orderList.cart[i].rqty >= 1));
    console.log(this.orderList.cart[i].rqty);
    if(type == 'p' && this.orderList.cart[i].rqty < this.orderList.cart[i].qty)
    {
      this.orderList.cart[i].rqty = this.orderList.cart[i].rqty+1;
    }
    else if(this.orderList.cart[i].rqty >= 1 && type == 'm')
    {
      this.orderList.cart[i].rqty = this.orderList.cart[i].rqty - 1;
    }

  }
  getOrderList() {
    // Use snapshotChanges().map() to store the key
    let list = this.db.list('/orderLists');
    let t = 0;
    list.snapshotChanges().pipe(
      map(changes =>
        changes.map(c => ({ key: c.payload.key, ...c.payload.val() }))
      )
    ).subscribe(orderLists => {
      let luid  = localStorage.getItem('login');
      orderLists.forEach((currentValue, index) => {
        if( currentValue['key'] && currentValue['key'] == this.id)
        { 
          currentValue['cart'].forEach((currentValue1, index1) => {
            currentValue['cart'][index1]['rqty'] = 0;
          });
          this.orderList = currentValue;
          
        }
          
        });
    });
  }

  removeProduct(index) {
    this.orderList[0].productDetail.splice(index, 1);
  }
  remove(x) {
    this.orderList.cart[x].qty = 0; 
  }
  makeid() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < 5; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
  }
  sendRequest() {
    let r = this.db.list('/returnRequest').push(this.orderList);
    if(r)
    {
      this.toastrService.success("Your Request is Send!");
      this.router.navigateByUrl('/myOrderList');
    }

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
