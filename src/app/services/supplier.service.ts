import { Injectable } from '@angular/core';
import 'rxjs/add/operator/toPromise';
import { UserModel } from '../models/user.model';
import { AngularFireDatabase, AngularFireList, AngularFireObject } from 'angularfire2/database';
import { AuthService } from '../authentication/core/auth.service';


@Injectable()
export class SupplierService {
  public dbPath = '/users';
  usersRef: AngularFireList<UserModel> = null;
  userRef: AngularFireObject<UserModel> = null;
  usersByoption: AngularFireList<UserModel>;
  needCredit = 0;
  constructor(
    private db: AngularFireDatabase,
    public authService: AuthService
  ) {

    this.usersRef = db.list(this.dbPath);
  }

  getUsersList(): AngularFireList<UserModel> {
    return this.usersRef;
  }
  getUsersByOption(option: string, value: string): AngularFireList<UserModel> {
    this.usersByoption = this.db.list(this.dbPath, ref => ref.orderByChild(option).equalTo(value));
    return this.usersByoption;
  }
  GetUser(id: string) {
    const itemPath = `${this.dbPath}/${id}`;
    this.userRef = this.db.object(itemPath);
    return this.userRef;
  }
  updateUser(key: string, value: any): void {
    this.usersRef.update(key, value).catch(error => this.handleError(error));
  }

  deleteUser(key: string): void {
    this.usersRef.remove(key).catch(error => this.handleError(error));

  }
  private handleError(error) {
    console.log(error);
  }
}
