import { Component, OnInit } from '@angular/core';

import { ProductService } from '../../../../services/product.service';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

import { AngularFireDatabase } from 'angularfire2/database';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-cat-products',
  templateUrl: './cat-products.component.html',
  styleUrls: ['./cat-products.component.css']
})
export class CatProductsComponent implements OnInit {
  products: any;
  checkChild = "cat_id";

  id: any;
  prod = new Array();
  error = false;
  odj: any;
  constructor(private actRoute: ActivatedRoute, private productService: ProductService, private db: AngularFireDatabase) {

  }

  ngOnInit() {
    this.actRoute.queryParams.subscribe(quer => {
      this.id = quer.categoryId;
      this.getData();
    });

  }

  getData() {

    this.productService.getProductbycat(this.checkChild, this.id).snapshotChanges().pipe(
      map(changes =>
        changes.map(c => ({ key: c.payload.key, ...c.payload.val() }))
      )
    ).subscribe(products => {
      this.products = products;
      console.log(this.products);
    });
  }
}


