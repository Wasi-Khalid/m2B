import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/operators';
import { ProductService } from '../../../services/product.service';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit {
  id: any;
  product: {
    $key: string; product_name: string; product_image_url: string;
    color: string; status: string; path: string;
    cat_id: number; supplierEmail: string;
    addOn: number; key: string;
  };
  constructor(private actRoute: ActivatedRoute, private productService: ProductService) {
    this.id = this.actRoute.snapshot.queryParamMap.get('productId');
  }

  ngOnInit() {
    this.getData();
  }

  getData() {

    this.productService.getProductbycat("key", this.id).snapshotChanges().pipe(
      map(changes =>
        changes.map(c => ({ key: c.payload.key, ...c.payload.val() }))
      )
    ).subscribe(products => {
      products.forEach(product => {
        this.product = product;
      });

    });

  }
}






