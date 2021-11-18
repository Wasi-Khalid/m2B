import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ProductModel } from '../../../../models/product.model';
import { ProductService } from '../../../../services/product.service';
import { map } from 'rxjs/operators';
import { CategoryService } from '../../../../services/category.service';
import { SupplierService } from '../../../../services/supplier.service';
@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.css']
})
export class EditProductComponent implements OnInit {


  addProductForm: FormGroup;


  product: ProductModel = new ProductModel();
  id2: string;
  nameCheck: string = "okk";
  ownEmail: any;
  users: any;
  user: any;
  checkChild = "email";
  categories: any;
  isSupplierProduct: boolean;
  path = "";
  imgName = "";
  status = [
    { name: "Enable", value: "Enable" },
    { name: "Disable", value: "Disable" }
  ]

  constructor(
    private actRoute: ActivatedRoute,
    private productSer: ProductService,
    private router: Router,
    private supplierService: SupplierService,
    private categoryService: CategoryService,
    private fb: FormBuilder) {

    this.createForm();

    const id = this.actRoute.snapshot.queryParamMap.get('productId');  // Getting current component's id or information using ActivatedRoute service
    this.id2 = id;
    if (id !== null) {
      this.productSer.GetProduct(id).valueChanges().subscribe(data => {
        console.log("data");
        console.log(data);
        this.path = data.path;
        this.imgName = data.product_image_url;

        if (this.nameCheck == "okk") {
          this.addProductForm.patchValue(data); // Using SetValue() method, It's a ReactiveForm's API to store intial value of reactive for
          this.addProductForm.setControl('productSKU', this.setSKU(data.productSKU))
          this.nameCheck = data.product_name;
        }
      })
    }
  }
  onFileChange($event) {
    let file = $event.target.files[0]; // <--- File Object for future use.
    this.addProductForm.controls['product_image_url'].setValue(file ? file.name : ''); // <-- Set Value for Validation
  }
  fileName = '';
  setSKU(productSKU): FormArray {
    const formArray = new FormArray([]);
    productSKU.forEach(data => {
      formArray.push(this.fb.group({
        SKU_Name: data.SKU_Name,
        SKU_Price: data.SKU_Price,
        SKU_Quantity: data.SKU_Quantity,
        SKU_Cost: data.SKU_Cost
      }));
    });
    return formArray;
  }
  createForm() {
    this.addProductForm = this.fb.group({
      product_name: [''],
      product_image_url: [''],
      id: [''],
      status: [''],
      color: [''],
      cat_id: [0],
      supplierEmail: [""],
      col_name1: [''],
      col_name2: [''],
      productSKU: this.fb.array([
        this.addProductSKU()
      ]),
      path: [''],
      addOn: [0]
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
  updateForm(value: any) {

    this.product.product_name = value.product_name;
    console.log(value.product_image_url == this.imgName);
    console.log(value.path);
    this.product.product_image_url = value.product_image_url;
    this.product.status = value.status;
    this.product.color = value.color;
    this.product.cat_id = value.cat_id;   //Category id
    this.product.col_name1 = value.col_name1;
    this.product.col_name2 = value.col_name2;
    this.product.supplierEmail = value.supplierEmail;
    value.productSKU.forEach(SKU => {
      SKU['SKU_sold_qty'] = SKU.SKU_Quantity;
    });
    this.product.productSKU = value.productSKU;
    this.product.id = value.id;
    this.product.path = value.path;
    this.product.addOn = Date.now();
    console.log(this.product);
    this.productSer.updateProduct(this.id2, this.product, this.imgName);

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


}



