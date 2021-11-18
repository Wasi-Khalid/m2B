import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList, AngularFireObject } from 'angularfire2/database';
import { AuthService } from '../authentication/core/auth.service';
import { AngularFireAuth } from 'angularfire2/auth';
import { ReturnRequestModel } from '../models/return-request.model';

@Injectable()
export class ReturnRequestService {

  public dbPath = '/returnRequest';
  ReturnRequestsRef: AngularFireList<ReturnRequestModel> = null;
  ReturnRequestRef: AngularFireObject<ReturnRequestModel> = null;
  ReturnRequestsByoption: AngularFireList<ReturnRequestModel>;


  constructor(private afAuth: AngularFireAuth,
    private db: AngularFireDatabase,
    public authService: AuthService
  ) {

    this.ReturnRequestsRef = db.list(this.dbPath);
  }
  createReturnRequest(ReturnRequest: ReturnRequestModel): void {
    this.ReturnRequestsRef.push(ReturnRequest);
  }
  setReturnRequest(id: string, ReturnRequest: ReturnRequestModel) {
    const itemPath = `${this.dbPath}/${id}`;
    this.ReturnRequestRef = this.db.object(itemPath);
    return this.ReturnRequestRef.set(ReturnRequest);
  }
  getReturnRequests(): AngularFireList<ReturnRequestModel> {
    return this.ReturnRequestsRef;
  }

  getReturnRequestsByOption(option: string, value: string): AngularFireList<ReturnRequestModel> {
    this.ReturnRequestsByoption = this.db.list(this.dbPath, ref => ref.orderByChild(option).equalTo(value));
    return this.ReturnRequestsByoption;
  }
  updateReturnRequest(key: string, value: any): void {

    this.ReturnRequestsRef.update(key, value).catch(error => this.handleError(error));
  }
  private handleError(error) {
    console.log(error);
  }
}



