import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CategoryService } from '../../../../services/category.service';
import { CategoryModel } from '../../../../models/category.model';

@Component({
  selector: 'app-add-category',
  templateUrl: './add-category.component.html',
  styleUrls: ['./add-category.component.css']
})
export class AddCategoryComponent implements OnInit {

  addCategoryForm: FormGroup;
  category: CategoryModel = new CategoryModel();

  constructor(private actroute: ActivatedRoute, private categorySer: CategoryService,
    private router: Router,
    private fb: FormBuilder) {
    this.createForm();
  }
  
  createForm() {
    this.addCategoryForm = this.fb.group({
      catName: ['', Validators.required],
      status: ['', Validators.required],
      catIcon: ['', Validators.required],
      userId: ['', Validators.required],

    });
  }

  ngOnInit() {

  }

  tryAddCategory(value) { 
    this.category.catName = value.catName;
    this.category.status = value.status;
    this.category.catIcon = value.catIcon;
    this.category.addOn = Date.now();
    this.category.userId = value.userId;
    this.categorySer.createCategory(this.category);
    this.router.navigate(['admin/categories']);
  }




}
