import { Component, OnInit } from '@angular/core';
import { CategoryService } from '../../../services/category.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})
export class CategoriesComponent implements OnInit {

  // popShow = true;
  categories: any;
  constructor(private categoryService: CategoryService) {

  }

  ngOnInit() {
    this.getCategoriesList();
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

  deleteCategoryOne(key: string) {
    this.categoryService.deleteCategory(key);

  }
}
