import { Injectable } from '@angular/core';
import { OrderListModel } from '../models/order-list.model';
import { AngularFireDatabase, AngularFireList, AngularFireObject } from 'angularfire2/database';
import { AuthService } from '../authentication/core/auth.service';

@Injectable()
export class OrderListService {
  isOrderAdded = false;
  public dbPath = '/orderLists';
  OrderListsRef: AngularFireList<OrderListModel> = null;
  OrderListRef: AngularFireObject<OrderListModel> = null;
  OrderListsByoption: AngularFireList<OrderListModel>;

  constructor(
    private db: AngularFireDatabase,
    public authService: AuthService
  ) {

    this.OrderListsRef = db.list(this.dbPath);
  }

  createOrderList(OrderList: OrderListModel): void {
    this.OrderListsRef.push(OrderList);
  }

  getOrderLists(): AngularFireList<OrderListModel> {
    return this.OrderListsRef;
  }
  getOrderListsByOption(option: string, value: string): AngularFireList<OrderListModel> {
    this.OrderListsByoption = this.db.list(this.dbPath, ref => ref.orderByChild(option).equalTo(value));
    return this.OrderListsByoption;
  }
  GetOrderList(id: string) {
    const itemPath = `${this.dbPath}/${id}`;
    this.OrderListRef = this.db.object(itemPath);
    return this.OrderListRef;
  }
  updateOrderList(key: string, value: any): void {
    this.OrderListsRef.update(key, value).catch(error => this.handleError(error));
  }

  private handleError(error) {
    console.log(error);
  }
}


