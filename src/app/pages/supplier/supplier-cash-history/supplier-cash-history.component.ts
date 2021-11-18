import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';
import { SupplierOrderListService } from '../../../services/supplier-order-list-service.service';
import { SupplierService } from '../../../services/supplier.service';

import { ReturnRequestService } from '../../../services/return-request.service';
import { ProductService } from '../../../services/product.service';

@Component({
  selector: 'app-supplier-cash-history',
  templateUrl: './supplier-cash-history.component.html',
  styleUrls: ['./supplier-cash-history.component.css']
})
export class SupplierCashHistoryComponent implements OnInit {

  supplierOrderList = new Array();
  checkChild = "email";
  ownEmail: string;
  user: any;
  count = 0;
  credit = 0;
  months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  now = new Date();
  thisMonth = '';
  requestedOrdersQty = 0;
  allSKUtotalQty = 0;
  totalSKUprofit = 0;
  totalRevenue = 0;
  allLastMonthQty = 0;
  allLastMonthQty1 = 0;
  today: any;
  date = 0;
  month = 0;
  year = 0;
  totalpercentage = 0;
  lastMonthDate: any;
  lastMonthTotalSKUprofit = 0;
  products: any = [];
  prodSKUTotalqty = 0;
  percentageOfLastMonth = 0;
  firstDayLastMonth: Date;
  lastDayLastMonth: Date;
  settongData: any;

  constructor(private returnRequestService: ReturnRequestService,
    private supplierOrderListService: SupplierOrderListService,
    private supplierService: SupplierService,
    private productService: ProductService) {
    this.ownEmail = JSON.parse(localStorage.getItem("user")).email;
    this.thisMonth = this.months[this.now.getMonth()];
    this.today = new Date();
    this.date = this.today.getDate();
    this.month = this.today.getMonth();
    this.year = this.today.getFullYear();
    this.lastMonthDate = new Date(this.year, this.month - 1, this.date);
    console.log(this.lastMonthDate);

    this.firstDayLastMonth = new Date(this.lastMonthDate.getFullYear(), this.lastMonthDate.getMonth(), 1);
    this.lastDayLastMonth = new Date(this.lastMonthDate.getFullYear(), this.lastMonthDate.getMonth() + 1, 0);
    console.log('firstDay:', this.firstDayLastMonth, 'lastDay', this.lastDayLastMonth);
    this.getProductsListProfit();
    this.getUserOption();
    this.getOrderListQty();
    this.getReturnRequestQty();
  }

  ngOnInit() {

    this.getOrderListQty();

  }


  getOrderListQty() {
    this.supplierOrderList = [];
    let totalQty = 0;
    this.allSKUtotalQty = 0;
    this.requestedOrdersQty = 0;
    let L_C_price = 0;
    let total_profit = 0;
    let orderDate: any;
    this.supplierOrderListService.getOrderLists().snapshotChanges()
      .pipe(
        map(changes =>
          changes.map(c => ({ key: c.payload.key, ...c.payload.val() }))
        )
      )
      .subscribe(supplierOrderList => {
        this.allSKUtotalQty = 0;
        this.allLastMonthQty = 0;
        this.allLastMonthQty1 = 0;
        this.totalSKUprofit = 0;
        this.lastMonthTotalSKUprofit = 0;
        supplierOrderList.forEach(order => {

          if (order.supplierEmail == this.ownEmail) {
            let ans = 0;
            ans = this.calculateProfit(order);
            console.log("ans: ", ans);
            this.totalSKUprofit += ans;
            this.allSKUtotalQty++;

            orderDate = new Date(order.addOn);

            console.log('firstDay:', this.firstDayLastMonth, 'lastDay', this.lastDayLastMonth, 'orderDate', this.lastMonthDate);
            console.log(this.lastDayLastMonth >= this.lastMonthDate && this.lastMonthDate >= this.firstDayLastMonth);
            if (this.lastDayLastMonth >= orderDate && orderDate >= this.firstDayLastMonth) {

              // ----
              this.allLastMonthQty1++;
              let ans = 0;
              ans = this.calculateProfit(order);
              console.log("ans: ", ans);
              this.lastMonthTotalSKUprofit += ans;

              // ---------
              order.productDetail.forEach(prod => {
                prod['productSKU'].forEach(SKU => {
                  this.allLastMonthQty += (+SKU.quantity ? +SKU.quantity : 0);
                })

              });

            }
          }
        })
        this.percentageOfLastMonth = Math.round((this.allLastMonthQty / this.prodSKUTotalqty) * 100);
      });
  }

  getReturnRequestQty() {
    this.returnRequestService.getReturnRequestsByOption('supplierEmail', this.ownEmail).snapshotChanges().pipe(
      map(changes =>
        changes.map(c => ({ key: c.payload.key, ...c.payload.val() }))
      )
    ).subscribe(requests => {
      requests.forEach(x => {
        if (x.requestApprove == '1') {
          this.requestedOrdersQty++;
        }
      });
    });

  }

  calculateProfit(order) {
    let L_C_price = 0;
    let total = 0;
    order.productDetail.forEach(prod => {

      let index = this.products.findIndex(x => x.id == prod['id']);

      prod['productSKU'].forEach(SKU => {
        L_C_price = 0;
        if (index > -1) {
          console.log(SKU.quantity);
          this.products[index].productSKU.forEach(product => {
            if (product.SKU_Name == SKU.SKU_Name) {
              L_C_price = (product.SKU_Price ? +product.SKU_Price : 0) - (product.SKU_Cost ? +product.SKU_Cost : 0);
              console.log(L_C_price);
            }
          });
          total += ((SKU.quantity ? SKU.quantity : 0) * L_C_price);
        }
      })

    });
    return total;
  }

  getProductsListProfit() {
    let totalQty = 0;
    let myprodSKUQty = 0;
    let myprodSKUQtySold = 0;
    this.productService.getProductsList().snapshotChanges().pipe(
      map(changes =>
        changes.map(c => ({ key: c.payload.key, ...c.payload.val() }))
      )
    ).subscribe(products => {
      this.products = products;
      totalQty = 0;
      products.forEach(product => {

        if (product.supplierEmail == this.ownEmail) {
          product.productSKU.forEach(SKU => {
            this.prodSKUTotalqty += (SKU.SKU_Quantity ? +SKU.SKU_Quantity : 0);
            totalQty = (+SKU.SKU_sold_qty ? +SKU.SKU_sold_qty : 0) - (+SKU.SKU_Quantity ? +SKU.SKU_Quantity : 0)
            this.totalRevenue += (totalQty * (SKU.SKU_Price ? +SKU.SKU_Price : 1));
            myprodSKUQty += (+SKU.SKU_sold_qty ? +SKU.SKU_sold_qty : 0);
            myprodSKUQtySold += totalQty;
          });

        }

      })

    });
  }

  getUserOption() {

    this.supplierService.getUsersByOption(this.checkChild, this.ownEmail).snapshotChanges().pipe(
      map(changes =>
        changes.map(c => ({ key: c.payload.key, ...c.payload.val() }))
      )
    ).subscribe(users => {
      users.forEach(user => {
        this.user = user;
        this.credit = this.user.credit;
      })

    });

  }

}
