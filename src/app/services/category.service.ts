import { Injectable } from '@angular/core';

import 'rxjs/add/operator/toPromise';
import * as firebase from 'firebase';
// import firebase from '@firebase/app';
import { CategoryModel } from '../models/category.model';
import { AngularFireDatabase, AngularFireList, AngularFireObject } from 'angularfire2/database';
import { environment } from '../../environments/environment';

@Injectable()

export class CategoryService {

  public dbPath = '/categories';

  categoriesRef: AngularFireList<CategoryModel> = null;
  categoryRef: AngularFireObject<CategoryModel> = null;
  categoriesListByoption: AngularFireList<CategoryModel>;
  constructor(

    private db: AngularFireDatabase
  ) {
    this.categoriesRef = db.list(this.dbPath);
  }


  createCategory(category: CategoryModel): void {
    this.categoriesRef.push(category);
  }

  getCategoriesList(): AngularFireList<CategoryModel> {
    return this.categoriesRef;
  }

  getCategoriesListByOption(option: string, value: string): AngularFireList<CategoryModel> {
    this.categoriesListByoption = this.db.list(this.dbPath, ref => ref.orderByChild(option).equalTo(value));
    return this.categoriesListByoption;
  }
  GetCategory(id: string) {
    const itemPath = `${this.dbPath}/${id}`;
    this.categoryRef = this.db.object(itemPath);
    return this.categoryRef;
  }
  updateCategory(key: string, value: any): void {
    this.categoriesRef.update(key, value).catch(error => this.handleError(error));
  }

  deleteCategory(key: string): void {
    this.categoriesRef.remove(key).catch(error => this.handleError(error));
  }
  private handleError(error) {
    console.log(error);
  }

}
