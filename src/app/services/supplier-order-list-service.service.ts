import { Injectable } from '@angular/core';

import { AngularFireDatabase, AngularFireList, AngularFireObject } from 'angularfire2/database';
import { AuthService } from '../authentication/core/auth.service';
import { SupplierOrderListModel } from '../models/supplier-order-list.model';
@Injectable()
export class SupplierOrderListService {
  isOrderAdded = false;
  public dbPath = '/supplierOrderLists';
  OrderListsRef: AngularFireList<SupplierOrderListModel> = null;
  OrderListRef: AngularFireObject<SupplierOrderListModel> = null;
  OrderListsByoption: AngularFireList<SupplierOrderListModel>;

  constructor(
    private db: AngularFireDatabase,
    public authService: AuthService
  ) {

    this.OrderListsRef = db.list(this.dbPath);
  }
  createOrderList(OrderList: SupplierOrderListModel): void {
    this.OrderListsRef.push(OrderList);
  }

  getOrderLists(): AngularFireList<SupplierOrderListModel> {
    return this.OrderListsRef;
  }
  getOrderListsByOption(option: string, value: string): AngularFireList<SupplierOrderListModel> {
    this.OrderListsByoption = this.db.list(this.dbPath, ref => ref.orderByChild(option).equalTo(value));
    return this.OrderListsByoption;
  }
  updateOrderList(key: string, value: any): void {
    this.OrderListsRef.update(key, value).catch(error => this.handleError(error));
  }
  GetOrderList(id: string) {
    const itemPath = `${this.dbPath}/${id}`;
    this.OrderListRef = this.db.object(itemPath);
    return this.OrderListRef;
  }
  private handleError(error) {
    console.log(error);
  }
}
