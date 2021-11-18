import { Component, OnInit, OnDestroy } from '@angular/core';
import { ProductService } from '../../../services/product.service';
import { map } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';
import { OrderListModel, SupplierOrderInfo } from '../../../models/order-list.model';
import { OrderListService } from '../../../services/order-list.service';

import { SupplierOrderListModel } from '../../../models/supplier-order-list.model';
import { SupplierOrderListService } from '../../../services/supplier-order-list-service.service';
import { SupplierService } from '../../../services/supplier.service';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../../../environments/environment';

import { Http, URLSearchParams } from '@angular/http';
import { EmailService } from '../../../services/email.service';
import { Subscription } from 'rxjs';
import { AngularFireDatabase, AngularFireList, AngularFireObject } from 'angularfire2/database';
@Component({
  selector: 'app-final-cart',
  templateUrl: './final-cart.component.html',
  styleUrls: ['./final-cart.component.css']
})
export class FinalCartComponent implements OnInit, OnDestroy {

  appUrl : string = environment.appUrl;
  checkChild = "email";
  ownEmail: string;
  isAddedCheck = "isAdded";
  selectProduct: any;
  supplierOrder = new Array();
  totalQtPrice: number;
  totalSelectPrice = 0;
  deliveryAddress = '';
  supplierDetail = new SupplierOrderInfo();
  productobj = new OrderListModel();
  supplierProductobj = new SupplierOrderListModel();

  supplierProdstruct = { productName: "", productPrice: 0, quantity: 0, supplierId: "", addOn: 0 };
  address = {
    'fname' :"",
    'lname' :"",
    'email' :"",
    'phone' :"",
    'address' :"",
    'town' :"",
    'state' :"",
    'postcode' :"",
    'country' :"United States",

  };
  saddress = {
    'fname' :"",
    'lname' :"",
    'email' :"",
    'phone' :"",
    'address' :"",
    'town' :"",
    'state' :"",
    'postcode' :"",
    'country' :"United States",

  };
  cart : any;
  userId : any;
  sameship : any;
  save_next : any;
  shipping_methods : any;
  smethod : any;
  constructor(
    private actRoute: ActivatedRoute,
    private toastrService: ToastrService,
    private productService: ProductService,
    private router: Router,
    private orderListService: OrderListService,
    private http: Http,
    private sendEmailService: EmailService,
    private supplierOrderListService: SupplierOrderListService,
    private supplierSer: SupplierService,
    private db: AngularFireDatabase
  ) {
    this.sameship = true;
    this.samount = 0;
    this.save_next = false;
    this.userId = localStorage.getItem('login');
    let list = this.db.list('/cart');
    list.snapshotChanges().pipe(
      map(changes =>
        changes.map(c => ({ key: c.payload.key, ...c.payload.val() }))
      )
    ).subscribe(cart => {
      this.cart = cart;
      this.calculateTotal();

    });
    list = this.db.list('/shipping_methods');

    list.snapshotChanges().pipe(
      map(changes =>
        changes.map(c => ({ key: c.payload.key, ...c.payload.val() }))
      )
    ).subscribe(shipping_methods => {
      this.shipping_methods = shipping_methods;
    });
    this.getUserByOption();

  }
  checkout()
  {
    let today = new Date();
let dd = String(today.getDate()).padStart(2, '0');
let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
let yyyy = today.getFullYear();

let t  = dd + '/' + mm + '/' + yyyy;

    let lcart = [];
    this.cart.forEach((currentValue, index) => {
        if(currentValue.uid == this.userId)
        {
          lcart.push(currentValue);
        }
        });
     if(this.sameship)
     {
      this.saddress = this.address;
     }
     if(this.save_next)
     {
      let us = Object.keys(this.user).map(key => ({type: key, value: this.user[key]}));
      us['future'] = {
        'address':this.address,
        'saddress':this.saddress,
        'save_next':this.save_next,
        'sameship':this.sameship,
      };

      console.log(us);


           let r = this.db.list('/users').update(this.userId, us);
     }

    let order = {
      'date':t,
      'uid':this.userId,
      'tot':this.tot,
      'cart':lcart,
      'address':this.address,
      'saddress':this.saddress,
      'status':'Pending',
    };
    if(this.smethod)
    {
    order['shipping'] = this.shipping_methods[this.smethod];
  }


    console.log(order);
    let r = this.db.list('/orderLists').push(order);
    if(r)
    {
      this.cart.forEach((currentValue, index) => {
        if(currentValue.uid == this.userId)
        {
          let tutorialsRef = this.db.list('cart');
    let r = tutorialsRef.remove(currentValue.key);
          lcart.push(currentValue);
        }
        });
      alert('order create successfully!');

    }
    }
  stot : any;
  tot : any;
  calculateTotal()
  {
    this.tot = 0;
    this.stot = 0;
    this.cart.forEach((currentValue, index) => {
        if(currentValue.uid == this.userId)
        {
          console.log(currentValue.sku.SKU_Price+"x"+currentValue.qty);
          console.log((currentValue.sku.SKU_Price * currentValue.qty));
          this.tot = this.tot + (currentValue.sku.SKU_Price * currentValue.qty);
          console.log("I m here"+this.tot);
          this.stot = this.tot;
          this.tot = Number(this.tot) +Number(this.samount);
        }
        });
  }
  updateqty(i,type)
  {
    if(type == 'm')
    {
      this.cart[i].qty= this.cart[i].qty -1;

    }
    else{
      this.cart[i].qty= this.cart[i].qty +1;
    }
    this.calculateTotal();
  }
  orderList : any;
  ngOnInit() {
    // this.getCurrentUserInfo();
    this.orderList = JSON.parse(localStorage.getItem('orderData'));
    this.calculateTotal();
  }
  samount :any;
  shipping()
  {
    this.samount = this.shipping_methods[this.smethod].price;
    // alert(this.samount);
    this.calculateTotal();
  }
  ngOnDestroy() {
  }

  /*createOrderForSuplliers() {
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

      this.orderList.forEach((x) => {

        if (x.supplierEmail == email) {
          sameProd.push(x);


          x.productSKU.forEach(el => {
            prodTotal = el.quantity * el.SKU_Price;
            supplierTotal = supplierTotal + prodTotal;
          });
        }
      })

      sameProd.forEach((x) => {
        this.supplierDetail.totalProductName.push({
          productName: x.productName
        });
      })
      this.supplierProductobj.productDetail = sameProd;
      this.supplierProductobj.supplierEmail = email;
      this.supplierProductobj.userName = this.user.name;
      this.supplierProductobj.requested = "0";
      this.supplierProductobj.addOn = Date.now();
      this.msgStruct = [{
        message: 'Welcome to M2B', timeSent: Date.now().toString(), userName: "Supplier", senderId: '', senderEmail: email
      }]
      this.supplierProductobj.messages = this.msgStruct;
      this.supplierProductobj.supplierUnread = 0;
      this.supplierProductobj.deliverAddress = this.deliveryAddress;
      this.supplierProductobj.lastAddedMsgDate = Date.now().toString();
      this.supplierProductobj.userUnread = 1;
      this.supplierProductobj.userEmail = this.ownEmail;//
      this.supplierProductobj.userPhone = this.user.phoneNo;
      this.supplierProductobj.totalPrice = supplierTotal;
      this.supplierProductobj.orderID = this.productobj.id;
      this.supplierProductobj.userOrderID = this.makeid();
      this.supplierDetail.supplierOrderId = this.supplierProductobj.userOrderID;

      // Setting Email Data for admin and send
      console.log(this.supplierDetail);
      this.arr.push(this.supplierDetail);
      this.supplierOrderListService.createOrderList(this.supplierProductobj);
      this.supplierTag.title = "New Order Just Placed !";
      this.supplierTag.data = `<span style="font-weight: bold;">User Name:</span>  ${this.user.name} <p>
      Delivery Address :<br/>
        ${this.deliveryAddress} <br/>
        ${this.user.phoneNo }<br/>
        Delivery Time :<br/>
        3 Business  Day<br/>
      </p>`;


      this.supplierTag.link = ` <p style="background-color: #ff8e32;border: 2px solid #ffffff;color:#ffffff;border-radius: .5rem;font-size: 14px;font-weight: 600;line-height:1;padding: 20px 13px;text-align:center;margin-left: 21%;margin-right: 20%;cursor: pointer;"><a href="${this.appUrl}/#/admin/order-list" >Check Order Detail</a></p> `
      container.productDetail = this.orderList;
      this.sendEmailService.sendEmail(email, this.supplierTag, this.totalSelectPrice, container);
      console.log(this.arr);
      supplierTotal = 0;
      prodTotal = 0
      sameProd = [];
      this.supplierDetail = new SupplierOrderInfo();
    })

  }*/


  
  credit : any;
  user : any;
  getUserByOption() {
    this.ownEmail = JSON.parse(localStorage.getItem("user"));
    if(this.ownEmail['email'])
    {
      this.supplierSer.getUsersByOption('email', this.ownEmail['email']).snapshotChanges().pipe(
        map(changes =>
          changes.map(c => ({ key: c.payload.key, ...c.payload.val() }))
        )
      ).subscribe(users => {
        this.user = users[0];

        if(users[0]['future'])
        {
          this.address = users[0]['future']['address'];
          this.saddress = users[0]['future']['saddress'];
          this.save_next = users[0]['future']['save_next'];
          this.sameship = users[0]['future']['sameship'];
        }
        this.address.email = users[0].email.toString();
        this.address['phone'] = users[0].phoneNo.toString();
        this.credit = users[0].credit.toString();

      });
    }

  }

}






