import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';
import { SupplierService } from '../../../services/supplier.service';
import { ReturnRequestModel } from '../../../models/return-request.model';
import { CashoutRequestService } from '../../../services/cashout-request.service';

@Component({
  selector: 'app-cashout-request',
  templateUrl: './cashout-request.component.html',
  styleUrls: ['./cashout-request.component.css']
})
export class CashoutRequestComponent implements OnInit {

  userData = new ReturnRequestModel();
  ownEmail: string;
  requests = [];
  emails = [];
  user = [];
  constructor(
    private supplierService: SupplierService,
    private cashoutRequestService: CashoutRequestService) {
  }

  ngOnInit() {
    this.getUsersList();

  }

  getUsersList() {
    // Use snapshotChanges().map() to store the key
    this.requests = [];
    this.cashoutRequestService.getCashoutRequests().snapshotChanges().pipe(
      map(changes =>
        changes.map(c => ({ key: c.payload.key, ...c.payload.val() }))
      )
    ).subscribe(requests => {
      this.requests = requests;
      console.log(this.requests)
      requests.forEach(request => {
        this.getUserOption(request.supplierEmail);

      });
    });

  }

  getUserOption(email) {
    this.supplierService.getUsersByOption("email", email).snapshotChanges().pipe(
      map(changes =>
        changes.map(c => ({ key: c.payload.key, ...c.payload.val() }))
      )
    ).subscribe(users => {
      users.forEach(user => {
        this.user.push(user);
      })
    });
    console.log(this.user);
  }


  approveRequest(key) {

    this.userData = this.requests.find(x => x.key == key);
    console.log(this.userData)
    this.userData.requestApprove = "1";
    console.log(this.userData)
    this.cashoutRequestService.updateCashoutRequest(key, this.userData);


  }
}
