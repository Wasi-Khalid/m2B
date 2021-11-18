import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';
import { SupplierService } from '../../../services/supplier.service';
import { ReturnRequestService } from '../../../services/return-request.service';
import { ReturnRequestModel } from '../../../models/return-request.model';


@Component({
  selector: 'app-return-request-for-supplier',
  templateUrl: './return-request-for-supplier.component.html',
  styleUrls: ['./return-request-for-supplier.component.css']
})
export class ReturnRequestForSupplierComponent implements OnInit {


  userData = new ReturnRequestModel();
  ownEmail: string;
  requests = [];
  emails = [];
  user = [];
  constructor(
    private supplierService: SupplierService,
    private returnRequestService: ReturnRequestService, ) {

  }

  ngOnInit() {
    this.ownEmail = JSON.parse(localStorage.getItem("user")).email;
    this.getUsersList();

  }

  getUsersList() {
    // Use snapshotChanges().map() to store the key

    this.returnRequestService.getReturnRequestsByOption('supplierEmail', this.ownEmail).snapshotChanges().pipe(
      map(changes =>
        changes.map(c => ({ key: c.payload.key, ...c.payload.val() }))
      )
    ).subscribe(requests => {
      this.requests = requests;
      console.log(requests)
      requests.forEach(request => {
        this.getUserOption(request.userEmail);

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

    let index = this.requests.findIndex(x => x.key == key);
    this.userData = this.requests[index];
    console.log(this.userData)
    this.userData.requestApprove = "1";
    console.log(this.userData);
    this.returnRequestService.updateReturnRequest(key, this.userData);
    this.requests = [];

  }


}
