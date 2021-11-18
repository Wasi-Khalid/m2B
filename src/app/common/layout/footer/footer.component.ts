import { Component, OnInit, Input } from '@angular/core';
import { LoggedInAsService } from '../../../authentication/logged-in-as.service';
// import { ToastrService } from 'ngx-toastr';
import { OrderListService } from '../../../services/order-list.service';
import { map } from 'rxjs/operators';
import { AuthService } from '../../../authentication/core/auth.service';
import { SupplierService } from '../../../services/supplier.service';
import { AngularFireDatabase, AngularFireList, AngularFireObject } from 'angularfire2/database';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
  checkChild = "email";
  isOrderAdded = false;

  currentActiveUser: string;
  LocalStorageData: any;
  option: string;
  tot : any;
  cart : any;
  constructor(private supplierService: SupplierService, private activeUserService: LoggedInAsService, private orderListService: OrderListService, private authService: AuthService,private db: AngularFireDatabase) {
    this.LocalStorageData = JSON.parse(localStorage.getItem("user"));
    this.checkUserOption();
    this.tot = 0;
    let list = this.db.list('/cart');
    list.snapshotChanges().pipe(
      map(changes =>
        changes.map(c => ({ key: c.payload.key, ...c.payload.val() }))
      )
    ).subscribe(cart => {
      this.cart = cart;
      console.log('footer cart');
      let t = 0;
      let luid  = localStorage.getItem('login');
      this.cart.forEach((currentValue, index) => {
        if(currentValue.uid == luid)
        {
          t = t+ (currentValue.sku.SKU_Price * currentValue.qty);
        }
        });
      //sku
      this.tot = t;

    });
  }

  ngOnInit() {
    this.checkOrder();

  }
  checkUserOption() {
    this.supplierService.getUsersByOption(this.checkChild, this.LocalStorageData.email).snapshotChanges().pipe(
      map(changes =>
        changes.map(c => ({ key: c.payload.key, ...c.payload.val() }))
      )
    ).subscribe(users => {

      this.currentActiveUser = users[0].option;
    });
  }
  checkOrder() {
    // Use snapshotChanges().map() to store the key
    this.orderListService.getOrderLists().snapshotChanges()
      .pipe(
        map(changes =>
          changes.map(c => ({ key: c.payload.key, ...c.payload.val() }))
        )
      )
      .subscribe(orderList => {
        orderList.forEach(product => {
          if (product.userEmail == this.LocalStorageData.email) {
            console.log(this.isOrderAdded);
            this.isOrderAdded = true;

          }
        });

      });
  }
}
