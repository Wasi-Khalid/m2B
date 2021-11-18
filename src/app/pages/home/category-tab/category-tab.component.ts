import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { routes } from '../../../app.routes';
import { map } from 'rxjs/operators';
import { ProductService } from '../../../services/product.service';
import { CategoryService } from '../../../services/category.service';



@Component({
  selector: 'app-category-tab',
  templateUrl: './category-tab.component.html',
  styleUrls: ['./category-tab.component.css']
})
export class CategoryTabComponent implements OnInit {
  products: any;
  id = "";

  checkChild = "cat_id";
  error = false;
  currentProduct = new Array();
  coutId: string;
  cat="";
  

  constructor(private actRoute: ActivatedRoute,private categoryService: CategoryService, private productService: ProductService,private router: Router) {
    console.log(this.actRoute.snapshot.queryParamMap.get('cOut'))
    this.coutId = this.actRoute.snapshot.queryParamMap.get('cOut');
    this.getAllData();
    // this.getData();
    if (this.coutId) {
      localStorage.removeItem('orderData2');

    }
  }
  ngOnInit() {
    this.actRoute.queryParams.subscribe(quer => {
      console.log(quer.categoryId==='');
      if(Object.keys(quer).length === 0 && quer.constructor === Object){
        this.cat = '';
        this.router.navigateByUrl('/home/products?categoryId='+this.id);
      }else if (quer.categoryId == undefined || quer.categoryId==='') {
        this.cat = '';
        this.router.navigateByUrl('/home/products?categoryId='+this.id);
      } else {
        this.cat = '123';
        this.id = quer.categoryId;
        this.getData();
      }
    });

  }
  
  getAllData() {

    this.categoryService.getCategoriesList().snapshotChanges().pipe(
      map(changes =>
        changes.map(c => ({ key: c.payload.key, ...c.payload.val() }))
      )
    ).subscribe(categories => {
      this.id = categories[0].key;
      if(this.cat == ''){
        this.router.navigateByUrl('/home/products?categoryId='+this.id);
        
      }
      console.log(categories);
      console.log(this.id);
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




