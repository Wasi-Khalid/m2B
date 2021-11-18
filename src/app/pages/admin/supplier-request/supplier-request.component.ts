import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';
import { SupplierService } from '../../../services/supplier.service';
import { UserModel } from '../../../models/user.model';

@Component({
  selector: 'app-supplier-request',
  templateUrl: './supplier-request.component.html',
  styleUrls: ['./supplier-request.component.css']
})
export class SupplierRequestComponent implements OnInit {

  users = [];
  userData = new UserModel();
  constructor(private supplierService: SupplierService) { }

  ngOnInit() {
    this.getUsersList();

  }

  getUsersList() {
    // Use snapshotChanges().map() to store the key

    this.supplierService.getUsersByOption('option', 'Supplier').snapshotChanges().pipe(
      map(changes =>
        changes.map(c => ({ key: c.payload.key, ...c.payload.val() }))
      )
    ).subscribe(users => {
      console.log(users);
      users.forEach(user => {
        if (user.requestApprove == '0') {
          this.users.push(user);
        }
      });
    });

  }

  approveRequest(key) {
    this.userData = this.users.find(x => x.key == key);
    this.userData.requestApprove = "1";
    this.supplierService.updateUser(key, this.userData);
    this.users = [];
  }

}
