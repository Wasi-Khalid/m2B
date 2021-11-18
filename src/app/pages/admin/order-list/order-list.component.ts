import { Component, OnInit } from '@angular/core';
import { OrderListService } from '../../../services/order-list.service';
import { map } from 'rxjs/operators';
import { SupplierService } from '../../../services/supplier.service';
import { AuthService } from '../../../authentication/core/auth.service';
import { OrderListModel } from '../../../models/order-list.model';
import { SupplierOrderListService } from '../../../services/supplier-order-list-service.service';
import { SettingService } from '../../../services/setting.service';
import { EmailService } from '../../../services/email.service';
import { ConditionalExpr } from '@angular/compiler';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.css']
})
export class OrderListComponent implements OnInit {

  appUrl : string = environment.appUrl;
  orderList: any;
  myProduct = new Array();
  checkChild = "email";
  courierInfo = [
    {name: 'DHL' , value: 1 },
    {name: 'UPS' , value: 2 },
    {name: 'USPS' , value: 3 },
  ]
  // key: string;
  // option: string;
  isSupplierProduct: boolean;
  myOrder = new OrderListModel();
  count = 0;
  totalPrice: number;
  totalOrder = new Array();
  supplierOrderList = [];
  ownEmail: any;
  supplierTotalCredit=0;
  user: any;
  supplierTag = {title:"", data:"" , link:"" };
  isCheckout = false;
  supplierCredit:number;
  settongData: any;
  isSave = [];
  userOrder= [];
  constructor(
    private settingService: SettingService,
    private orderListService: OrderListService,
    private supplierService: SupplierService,
    private authService: AuthService,
    private sendEmailService:EmailService,
    private supplierOrderListService: SupplierOrderListService) {
    this.ownEmail = JSON.parse(localStorage.getItem("user")).email;
    
  }

  ngOnInit() {
    this.getUserOption();
    this.supplierOrderList= [];
    this.getOrderList();
    
  }

  onClick(){

  }
  onEdit(index){
    this.isSave[index] = false;
  }
  
  onSave(index){
    let container = {
      productDetail : []
    }
    let trackingObj = [{
      trackingNo:'',
      courierInfo:'',
      timeEst:''
    }]
    console.log(this.supplierOrderList[index]);
    console.log(this.supplierOrderList[index].trackingNo , this.supplierOrderList[index].courierInfo , this.supplierOrderList[index].timeEst  );
if((this.supplierOrderList[index].trackingNo == '' || this.supplierOrderList[index].trackingNo == undefined) && (this.supplierOrderList[index].courierInfo == '' || this.supplierOrderList[index].courierInfo == undefined) && (this.supplierOrderList[index].timeEst == '' || this.supplierOrderList[index].timeEst == undefined) ){

  console.log("Values are empty!");
}else{
  // console.log("Values are Not empty!");
  let ind = this.orderList.findIndex(x => x.id == this.supplierOrderList[index].orderID);
  this.orderList[ind].status = 'Shipped';
  trackingObj[0].trackingNo = this.supplierOrderList[index].trackingNo;
  trackingObj[0].courierInfo = this.supplierOrderList[index].courierInfo;
  trackingObj[0].timeEst = this.supplierOrderList[index].timeEst;
  this.orderList[ind].trackingNoList = trackingObj;
  this.orderListService.updateOrderList(this.orderList[ind].key , this.orderList[ind]);

  this.supplierOrderListService.updateOrderList(this.supplierOrderList[index].key , this.supplierOrderList[index]);
  this.isSave[index] = true;
  this.supplierTag.data="Your Order is on it's way!";
    this.supplierTag.title ="Thank You!";
    this.supplierTag.link = ` <p style="background-color: #ff8e32;border: 2px solid #ffffff;color:#ffffff;border-radius: .5rem;font-size: 14px;font-weight: 600;line-height:1;padding: 20px 13px;text-align:center;margin-left: 21%;margin-right: 20%;cursor: pointer;"><a href="${this.appUrl}/#/myOrderList" >Check Order Detail</a></p> `
    container.productDetail= this.orderList;
  this.sendEmailService.sendEmail(this.supplierOrderList[index].userEmail,this.supplierTag,  -2 , this.supplierOrderList[index].trackingNo );

}
       
  }


  getOrderList() {
    // Use snapshotChanges().map() to store the key
    this.supplierOrderList =[];
    this.userOrder =[];
    this.isSave =[];
    this.orderListService.getOrderLists().snapshotChanges()
      .pipe(
        map(changes =>
          changes.map(c => ({ key: c.payload.key, ...c.payload.val() }))
        )
      )
      .subscribe(orderList => {
        console.log(this.isSupplierProduct);
        this.orderList = orderList;
        
        console.log(this.totalOrder);
        console.log(this.orderList);

      });


      

    this.supplierOrderListService.getOrderLists().snapshotChanges()
      .pipe(
        map(changes =>
          changes.map(c => ({ key: c.payload.key, ...c.payload.val() }))
        )
      )
      .subscribe(supplierOrderList => {
        this.userOrder =[];
        this.supplierTotalCredit = 0;
        this.supplierOrderList =  this.supplierOrderList ? []:this.supplierOrderList;
        supplierOrderList.forEach(order => {
          
          if (this.user.email == order.supplierEmail) {
            this.isSave.push(true);
            this.supplierOrderList.push(order);
            this.supplierTotalCredit =  this.supplierTotalCredit + order.totalPrice;
            console.log(this.supplierOrderList);
            console.log(this.userOrder);
          }
        })
        this.user.credit = this.supplierTotalCredit;
      });
     
  }

  getUserOption() {

    this.supplierService.getUsersByOption(this.checkChild, this.ownEmail).snapshotChanges().pipe(
      map(changes =>
        changes.map(c => ({ key: c.payload.key, ...c.payload.val() }))
      )
    ).subscribe(users => {
      users.forEach(user =>{
        this.user = user;
      })
      if (this.user.option == 'Supplier') {
        this.isSupplierProduct = false;
      } else {
        this.isSupplierProduct = true;
      }
    });

  }
}
