import { Component, OnInit, OnDestroy } from '@angular/core';
import { ProductService } from '../../../services/product.service';
import { map } from 'rxjs/operators';
import { SupplierService } from '../../../services/supplier.service';
import { AuthService } from '../../../authentication/core/auth.service';
import { CategoryService } from '../../../services/category.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit, OnDestroy {
  checkChild = "email";
  products: any;
  myProduct = new Array();
  isSupplierProduct: boolean;
  ownEmail: any;
  user: any;
  categoriesName = [];
  constructor(
    private categoryService: CategoryService,
    private productService: ProductService,
    private supplierService: SupplierService,
    private authService: AuthService) {

  }

  ngOnInit() {
    this.ownEmail = JSON.parse(localStorage.getItem("user")).email;
    this.getUserOption();
    this.getProductsList();
  }
  ngOnDestroy() {
    this.myProduct = [];
  }

  getProductsList() {
    this.categoriesName = [];
    // Use snapshotChanges().map() to store the key
    this.productService.getProductsList().snapshotChanges().pipe(
      map(changes =>
        changes.map(c => ({ key: c.payload.key, ...c.payload.val() }))
      )
    ).subscribe(products => {
      this.myProduct = [];

      products.forEach(product => {

        if (this.user.email == product.supplierEmail) {
          this.myProduct.push(product);
        } else {
          this.products = products;
        }

      })
      this.myProduct.forEach(ele => {
        this.getCategoriesList(ele.cat_id);
      });
    });
  }
  getCategoriesList(id) {
    console.log(id)

    // Use snapshotChanges().map() to store the key
    this.categoryService.getCategoriesListByOption("key", id).snapshotChanges().pipe(
      map(changes =>
        changes.map(c => ({ key: c.payload.key, ...c.payload.val() }))
      )
    ).subscribe(cat => {
      console.log(cat)
      this.categoriesName.push(cat[0]['catName']);
    });
    console.log(this.categoriesName)
  }
  deleteProductOne(key: string) {
    this.productService.deleteProduct(key);

  }
  getUserOption() {
    this.myProduct = [];
    this.supplierService.getUsersByOption(this.checkChild, this.ownEmail).snapshotChanges().pipe(
      map(changes =>
        changes.map(c => ({ key: c.payload.key, ...c.payload.val() }))
      )
    ).subscribe(users => {
      users.forEach(user => {
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
