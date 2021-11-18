import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router,ActivatedRoute} from '@angular/router';
import { CategoryModel } from '../../../../models/category.model';
import { CategoryService } from '../../../../services/category.service';

@Component({
  selector: 'app-edit-category',
  templateUrl: './edit-category.component.html',
  styleUrls: ['./edit-category.component.css']
})
export class EditCategoryComponent implements OnInit {

 
  addCategoryForm: FormGroup;
  
  category: CategoryModel = new CategoryModel();
  id2: string;
  nameCheck: string = "okk";
  
  constructor(private actRoute: ActivatedRoute ,private categorySer: CategoryService,
    private router: Router,
    private fb: FormBuilder ) {
     
      this.createForm();

      const id = this.actRoute.snapshot.queryParamMap.get('categoryId');  // Getting current component's id or information using ActivatedRoute service
       this.id2 = id;
       if( id !== null){
       this.categorySer.GetCategory(id).valueChanges().subscribe(data => {
          
          if(this.nameCheck == "okk"){
          this.addCategoryForm.setValue(data); // Using SetValue() method, It's a ReactiveForm's API to store intial value of reactive for
          this.nameCheck = data.catName;
        } 
        })
      }
 }
 
    createForm() {
      this.addCategoryForm = this.fb.group({
        catName:['' ],
        status: [''],
        userId: [''],
        catIcon: [''],
        addOn: ['']
      });
    }

  ngOnInit() {
    
       
  }
  

  updateForm( value: any){

    this.category.catName = value.catName,
    this.category.status = value.status;
    this.category.catIcon = value.catIcon;
    this.category.addOn = Date.now();
    this.category.userId = value.userId;
    this.categorySer.updateCategory(this.id2, this.category);
    this.router.navigate(['admin/categories']);
         
       
    }

}
