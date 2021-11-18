import { Component, OnInit, OnDestroy } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ProductService } from '../../../services/product.service';
import { map } from 'rxjs/operators';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-basic-cart',
  templateUrl: './basic-cart.component.html',
  styleUrls: ['./basic-cart.component.css']
})
export class BasicCartComponent implements OnInit, OnDestroy {
  id: string;
  selectProduct: any;
  isClicked = true;
  defualSelect = 1;
  prodDetail: any;
  prodKey: string;
  SKU = new Array();
  SKUFinal = [];
  SKU_Quantity: number;
  OrderDetail = {
    id: '',
    productName: "",
    supplierEmail: "",
    productSKU: [],
    col1Title: "",
    col2Title: ""
  }
  previous = [];
  productSub: Subscription;

  constructor(private productService: ProductService, private actRoute: ActivatedRoute, private router: Router, private toastrService: ToastrService) {
    this.id = this.actRoute.snapshot.queryParamMap.get('productId');
    this.selectProduct = { name: "", product_name: "None" };
    if (localStorage.getItem('orderData') == "undefined" || localStorage.getItem('orderData') == "[]") {
      localStorage.removeItem('orderData');
      this.router.navigateByUrl('home/products');
    } else if (!localStorage.getItem('orderData')) {
      this.getData();
    } else {

      this.getData2();
    }

  }

  ngOnInit() {
  }
  ngOnDestroy() {
    if (this.productSub) {
      this.productSub.unsubscribe();
    }
  }
  isDisable() {
    this.isClicked = false;

  }

  getData2() {
    let SKU2 = [];
    SKU2 = JSON.parse(localStorage.getItem('orderData'));
    let index = SKU2.findIndex(x => x.order_id == this.id);
    if (index == -1) {
      this.getData();
    } else {
      this.selectProduct = { name: "", product_name: SKU2[index].productName };

      this.SKU = SKU2[index].productSKU;
      this.OrderDetail.id = SKU2[index].id;
      this.OrderDetail.supplierEmail = SKU2[index].supplierEmail;
      this.OrderDetail.productName = SKU2[index].productName;
      this.OrderDetail.col1Title = SKU2[index].col1Title;
      this.OrderDetail.col2Title = SKU2[index].col2Title;
    }

  }
  getData() {

    this.productSub = this.productService.getProductbycat("id", this.id).snapshotChanges().pipe(
      map(changes =>
        changes.map(c => ({ key: c.payload.key, ...c.payload.val() }))
      )
    ).subscribe(productDetail => {
      console.log(productDetail);
      productDetail.forEach(product => {
        this.selectProduct = product;
        this.SKU = product.productSKU;
        this.OrderDetail.id = product.id;
        this.OrderDetail.supplierEmail = product.supplierEmail;
        this.OrderDetail.productName = product.product_name;
        this.OrderDetail.col1Title = product.col_name1;
        this.OrderDetail.col2Title = product.col_name2;
      });

      if (productDetail.length < 1) {
        this.toastrService.info('Select Product First!');
      }

    });
    this.SKU.forEach(data => {
      data['quantity'] = 0;
      data["col1Value"] = "";
      data["col2Value"] = "";

    })

  }


  removeSKU(index) {
    this.SKU.splice(index, 1);
  }

  createOrderCollection(act) {
    let order = [];
    this.OrderDetail.productSKU.forEach((SKU, index) => {
      if (SKU.quantity !== 0 && SKU.quantity && SKU.quantity >= 1) {
        order.push(SKU);
      }
    })
    this.OrderDetail.productSKU = order;
    console.log(this.OrderDetail);
    this.OrderDetail["order_id"] = this.makeid();
    if (this.OrderDetail.productSKU.length > 0) {
      if (!localStorage.getItem('orderData')) {
        this.previous.push(this.OrderDetail);
        console.log(this.previous);
        localStorage.setItem('orderData', JSON.stringify(this.previous))
      } else {
        this.previous = JSON.parse(localStorage.getItem('orderData'));
        let index = this.previous.findIndex(x => x.order_id == this.id);
        if (index == -1 && this.id !== 'review') {
          this.previous.push(this.OrderDetail);
          localStorage.setItem('orderData', JSON.stringify(this.previous));
        } else {
          this.previous[index] = this.OrderDetail;
          localStorage.setItem('orderData', JSON.stringify(this.previous));
        }
      }


    } else {
      this.toastrService.info('Product quantity not added or wrong!');
    }
    if (act == 'done') {
      this.router.navigateByUrl('/basic-cart/final-cart?productId=' + this.id);
    } else {
      this.router.navigateByUrl('/home/products');
    }

  }
  resetData() {
    this.getData2();
  }
  makeid() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < 5; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
  }
  showToast(act) {
    let checkQty = true;
    this.SKU.forEach(el => {
      el.quantity = (el.col1Value ? el.col1Value : 0) + (el.col2Value ? el.col2Value : 0);
      if (el.quantity > el.SKU_Quantity) {
        this.toastrService.info(`${el.SKU_Name} quantity is large, this is not available! Please Reduce the quantity!`);
        checkQty = false;
      }
    });
    if (checkQty) {
      this.OrderDetail.productSKU = this.SKU
      this.createOrderCollection(act);
    }

  }

}
