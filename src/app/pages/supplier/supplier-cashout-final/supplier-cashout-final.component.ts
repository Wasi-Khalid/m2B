import { Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { SettingService } from '../../../services/setting.service';
import { EmailService } from '../../../services/email.service';
import { SupplierService } from '../../../services/supplier.service';
import { CashoutRequestService } from '../../../services/cashout-request.service';
import { CashoutRequestModel } from '../../../models/cashout-request.model - Copy';
import { ProductService } from '../../../services/product.service';
import { SupplierOrderListService } from '../../../services/supplier-order-list-service.service';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-supplier-cashout-final',
  templateUrl: './supplier-cashout-final.component.html',
  styleUrls: ['./supplier-cashout-final.component.css']
})
export class SupplierCashoutFinalComponent implements OnInit {
  orderList: any;
  credit = 0;
  realCredit = 0;
  settongData: any;
  ownEmail:string;
  user: any;
  users=[];
  requestContainer = new CashoutRequestModel();
  allOrderList: any[];
  constructor( 
    private cashoutRequestService : CashoutRequestService,
    private settingService: SettingService,
    private sendEmail:EmailService,
    private toastrService: ToastrService,
    private supplierOrderListService: SupplierOrderListService, 
    private router: Router,
    private supplierSer: SupplierService,
    private productService: ProductService,) {
    this.orderList = JSON.parse(localStorage.getItem('orderCheckout'));
    this.ownEmail = JSON.parse(localStorage.getItem("user")).email;
    this.getsetting();
   }

  ngOnInit() {
    
    this.orderList.forEach(order => {
      this.realCredit =  order.totalPrice;


    });
    this.calculateCreditByPercentage();
    this.getCurrentUserInfo();
    this.getOrderList();
  }

  getsetting(){
    this.settingService.getSettingList().snapshotChanges().pipe(
      map(changes =>
        changes.map(c => ({ key: c.payload.key, ...c.payload.val() }))
      )
    ).subscribe(settings => {
      settings.forEach((setting)=>{
        this.settongData = setting;
      })
      this.calculateCreditByPercentage();
    });
  }
  
  calculateCreditByPercentage(){
    let ans = 0 ;
if(this.settongData){
  ans =  (+this.settongData.deduction / 100) * this.realCredit;

  this.credit =  Math.round((this.realCredit - ans) * 100) / 100;
}
   
    
  }
  onDone(){
    this.users.forEach(user => {
        this.sendEmail.supplierTag.title = 'Cashout Request!';
        this.sendEmail.supplierTag.data =`Supplier Name: ${ this.user.name } `;
        this.sendEmail.supplierTag.link ='';

        this.sendEmail.sendEmail(user.email ,this.sendEmail.supplierTag,this.credit , this.orderList[0]);

    });
    // 
    this.orderList.forEach((order)=>{
      let index =  this.allOrderList.findIndex(x=> x.userOrderID == order.userOrderID);
      if(index == -1){
        this.toastrService.info(' Cannot find order, Something went wrong!');
      }else{
        console.log(index);
        this.allOrderList[index].requested = "1";
        this.supplierOrderListService.updateOrderList(this.allOrderList[index].key, this.allOrderList[index]);
        
      }
      
    })



    this.createRequest();
    localStorage.removeItem('orderCheckout');
    this.router.navigate(['/supplierCashout']);
  }

  getOrderList(){
    this.allOrderList = [];
    this.supplierOrderListService.getOrderLists().snapshotChanges()
        .pipe(
          map(changes =>
            changes.map(c => ({ key: c.payload.key, ...c.payload.val() }))
          )
        )
        .subscribe(supplierOrderList => {
          this.allOrderList = supplierOrderList;
         
          
        });
  }
  createRequest(){

    this.orderList.forEach(order => {
      this.requestContainer.orderDetail.push(order.productDetail);
    });
    
    this.requestContainer.userRequestID = this.productService.makeid();
    this.requestContainer.totalPrice = this.credit;
    this.requestContainer.supplierEmail = this.ownEmail;
    this.requestContainer.requestApprove ="0";
    this.requestContainer.addOn= Date.now();
    this.cashoutRequestService.createCashoutRequest(this.requestContainer);
  }
  getCurrentUserInfo() {

    this.supplierSer.getUsersByOption("email", this.ownEmail).snapshotChanges().pipe(
      map(changes =>
        changes.map(c => ({ key: c.payload.key, ...c.payload.val() }))
      )
    ).subscribe(users => {
      users.forEach(user => {
        this.user = user;

      })
    });
  

    this.supplierSer.getUsersByOption("option", "Admin").snapshotChanges().pipe(
      map(changes =>
        changes.map(c => ({ key: c.payload.key, ...c.payload.val() }))
      )
    ).subscribe(users => {
      this.users = users;
      
    });
  }
}
