import { Component, OnInit } from '@angular/core';

import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { ProductModel } from '../../../../models/product.model';
import { ProductService } from '../../../../services/product.service';
import { CategoryService } from '../../../../services/category.service';
import { map } from 'rxjs/operators';
import { SupplierService } from '../../../../services/supplier.service';
import { AuthService } from '../../../../authentication/core/auth.service';


@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css']
})
export class AddProductComponent implements OnInit {



  checkChild = "email";
  categories: any;
  addProductForm: FormGroup;
  users: any;
  user: any;
  product: ProductModel = new ProductModel();
  supplierId: string;
  isSupplierProduct: boolean;
  userEmail: string;
  ownEmail: any;
  status = [
    { name: "Enable", value: "Enable" },
    { name: "Disable", value: "Disable" }
  ]
  constructor(
    private actroute: ActivatedRoute,
    private productSer: ProductService,
    private router: Router,
    private fb: FormBuilder,
    private categoryService: CategoryService,
    private authService: AuthService,
    private supplierService: SupplierService) {



    this.createForm();
  }

  createForm() {
    this.addProductForm = this.fb.group({
      name: ['', Validators.required],
      product_image_url: ['', Validators.required],
      status: ['', Validators.required],
      color: ['', Validators.required],
      catId: [0, Validators.required],
      userEmail: ['', Validators.required],
      col_name1: ['', Validators.required],
      col_name2: ['', Validators.required],
      productSKU: this.fb.array([
        this.addProductSKU()
      ]),
    });
  }
  addProductSKU(): FormGroup {
    return this.fb.group({
      SKU_Name: ["", Validators.required],
      SKU_Price: [0, Validators.required],
      SKU_Quantity: [0, Validators.required],
      SKU_Cost: [0, Validators.required]
    })
  }
  ngOnInit() {
    this.ownEmail = JSON.parse(localStorage.getItem("user")).email;
    this.getUserOption();
    this.getCategoriesList();
    this.getUsersList();
  }
  removeCat(index) {
    (<FormArray>this.addProductForm.get('productSKU')).removeAt(index)
  }
  addSKU() {

    (<FormArray>this.addProductForm.get('productSKU')).push(this.addProductSKU());

  }
  makeid() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < 5; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
  }
  getCategoriesList() {
    // Use snapshotChanges().map() to store the key
    this.categoryService.getCategoriesList().snapshotChanges().pipe(
      map(changes =>
        changes.map(c => ({ key: c.payload.key, ...c.payload.val() }))
      )
    ).subscribe(categories => {
      this.categories = categories;
    });
  }
  getUsersList() {
    // Use snapshotChanges().map() to store the key
    this.supplierService.getUsersByOption("option", "Supplier").snapshotChanges().pipe(
      map(changes =>
        changes.map(c => ({ key: c.payload.key, ...c.payload.val() }))
      )
    ).subscribe(users => {
      this.users = users;
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
      })
      if (this.user.option == 'Supplier') {
        this.isSupplierProduct = false;
      } else {
        this.isSupplierProduct = true;
      }
      console.log(this.isSupplierProduct);
    });

  }

  tryAddProduct(value) {
    console.log(value);
    this.product.product_name = value.name;
    this.product.product_image_url = value.product_image_url;
    this.product.status = value.status;
    this.product.color = value.color;
    this.product.cat_id = value.catId;   //Category id
    this.product.col_name1 = value.col_name1;
    this.product.col_name2 = value.col_name2;
    value.productSKU.forEach(SKU => {
      SKU['SKU_sold_qty'] = SKU.SKU_Quantity;
    });
    this.product.productSKU = value.productSKU;
    if (this.isSupplierProduct) {
      console.log(this.supplierId);
      this.product.supplierEmail = value.userEmail;
      console.log("Not supplier");
    } else if (!this.isSupplierProduct) {
      console.log("a supplier");
      this.product.supplierEmail = this.user.email;
      console.log(this.user.key);
    }
    this.product.addOn = Date.now();
    this.product.id = this.makeid();
    console.log(this.makeid())
    console.log(this.product)
    this.productSer.createProduct(this.product);
    this.router.navigate(['/admin/categories/products']);
    console.log(" cat iD " + this.product.cat_id);
    console.log(" user Email " + this.product.supplierEmail);
  }

}

