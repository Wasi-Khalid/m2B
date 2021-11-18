import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList, AngularFireObject } from 'angularfire2/database';
import { AuthService } from '../authentication/core/auth.service';
import { AngularFireAuth } from 'angularfire2/auth';
import { CashoutRequestModel } from '../models/cashout-request.model - Copy';

@Injectable()
export class CashoutRequestService {
  public dbPath = '/cashoutRequest';

  CashoutRequestsRef: AngularFireList<CashoutRequestModel> = null;
  CashoutRequestRef: AngularFireObject<CashoutRequestModel> = null;
  CashoutRequestsByoption: AngularFireList<CashoutRequestModel>;


  constructor(private afAuth: AngularFireAuth,
    private db: AngularFireDatabase,
    public authService: AuthService
  ) {

    this.CashoutRequestsRef = db.list(this.dbPath);
  }

  createCashoutRequest(cashoutRequest: CashoutRequestModel): void {
    this.CashoutRequestsRef.push(cashoutRequest);
  }
  setCashoutRequest(id: string, cashoutRequest: CashoutRequestModel) {
    const itemPath = `${this.dbPath}/${id}`;
    this.CashoutRequestRef = this.db.object(itemPath);
    return this.CashoutRequestRef.set(cashoutRequest);
  }
  getCashoutRequests(): AngularFireList<CashoutRequestModel> {
    return this.CashoutRequestsRef;
  }

  getCashoutRequestsByOption(option: string, value: string): AngularFireList<CashoutRequestModel> {
    this.CashoutRequestsByoption = this.db.list(this.dbPath, ref => ref.orderByChild(option).equalTo(value));
    return this.CashoutRequestsByoption;
  }
  updateCashoutRequest(key: string, value: any): void {
    this.CashoutRequestsRef.update(key, value).catch(error => this.handleError(error));
  }

  private handleError(error) {
    console.log(error);
  }
}
