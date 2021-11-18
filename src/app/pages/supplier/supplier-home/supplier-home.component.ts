import { Component, OnInit } from '@angular/core';
import { Role } from '../../../models/user.model';
import { Router } from '@angular/router';
import { SupplierService } from '../../../services/supplier.service';
import { CashoutRequestService } from '../../../services/cashout-request.service';
import { map } from 'rxjs/operators';
import { SupplierOrderListService } from '../../../services/supplier-order-list-service.service';

@Component({
  selector: 'app-supplier-home',
  templateUrl: './supplier-home.component.html',
  styleUrls: ['./supplier-home.component.css']
})
export class SupplierHomeComponent implements OnInit {
  LSRole: string;
  ownEmail: any;
  user: any;
  realCredit = 0;
  diffrRealCredit = 0;

  constructor(private router: Router,
    private cashoutRequestService: CashoutRequestService,
    private supplierService: SupplierService,
    private supplierOrderListService: SupplierOrderListService, ) {
    this.LSRole = localStorage.getItem("op");
    this.ownEmail = JSON.parse(localStorage.getItem("user")).email;

  }

  ngOnInit() {
    this.getUserOption();
    this.getOrderList();
    this.getCashoutList();
    if (this.LSRole === Role.Admin) {
      this.router.navigate(['/admin']);
    } else if (this.LSRole === Role.Business) {
      this.router.navigate(['/home/products']);
    } else if (this.LSRole === Role.Courier) {
      this.router.navigate(['/courier-map']);
    }


  }
  getOrderList() {
    this.supplierOrderListService.getOrderLists().snapshotChanges()
      .pipe(
        map(changes =>
          changes.map(c => ({ key: c.payload.key, ...c.payload.val() }))
        )
      )
      .subscribe(supplierOrderList => {
        this.realCredit = 0;
        supplierOrderList.forEach(order => {
          if (this.ownEmail == order.supplierEmail) {
            console.log(order);
            this.realCredit += order.totalPrice;
          }
        })

      });

  }
  getCashoutList() {
    this.cashoutRequestService.getCashoutRequestsByOption("supplierEmail", this.ownEmail).snapshotChanges()
      .pipe(
        map(changes =>
          changes.map(c => ({ key: c.payload.key, ...c.payload.val() }))
        )
      )
      .subscribe(cashoutOrderList => {
        cashoutOrderList.forEach(order => {
          if (order.requestApprove == '1') {
            this.diffrRealCredit += order.totalPrice;
          }
        })
        this.updateUser();
      });

  }
  updateUser() {
    if (this.user) {
      this.user.credit = (this.realCredit ? this.realCredit : 0) - (this.diffrRealCredit ? this.diffrRealCredit : 0);
      this.supplierService.updateUser(this.user.key, this.user);
    }
  }
  getUserOption() {

    this.supplierService.getUsersByOption('email', this.ownEmail).snapshotChanges().pipe(
      map(changes =>
        changes.map(c => ({ key: c.payload.key, ...c.payload.val() }))
      )
    ).subscribe(user => {
      this.user = user[0];

    });

  }

}






