import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';
import { ProductService } from '../../../services/product.service';

@Component({
  selector: 'app-item-sold',
  templateUrl: './item-sold.component.html',
  styleUrls: ['./item-sold.component.css']
})
export class ItemSoldComponent implements OnInit {
  ownEmail: any;
  myProduct = [];
  user: any;

  constructor(private productService: ProductService, ) {
    this.ownEmail = JSON.parse(localStorage.getItem("user")).email;
  }

  ngOnInit() {
    this.getProductsList();
  }
  getProductsList() {
    let totalQty = 0;
    this.productService.getProductsList().snapshotChanges().pipe(
      map(changes =>
        changes.map(c => ({ key: c.payload.key, ...c.payload.val() }))
      )
    ).subscribe(products => {
      this.myProduct = [];

      products.forEach(product => {

        if (this.ownEmail == product.supplierEmail) {
          product.productSKU.forEach(SKU => {
            totalQty = +SKU.SKU_sold_qty - +SKU.SKU_Quantity
            SKU['total_price'] = totalQty * SKU.SKU_Price;
            SKU['total_profit'] = (totalQty * SKU.SKU_Price) - (totalQty * SKU.SKU_Cost);
          });
          this.myProduct.push(product);

        }
      })

    });
  }
}
