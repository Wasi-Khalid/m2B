import { Component, OnInit } from '@angular/core';
import { SupplierService } from '../../../services/supplier.service';
import { map } from 'rxjs/operators';
import { AngularFireDatabase } from 'angularfire2/database';
import { ManageUserService } from '../../../services/manage-user.service';




@Component({
  selector: 'app-businesses',
  templateUrl: './businesses.component.html',
  styleUrls: ['./businesses.component.css']
})
export class BusinessesComponent implements OnInit {
  users: any;

  checkChild = "option";
  checkValue = "Business"

  constructor(private supplierService: SupplierService, private db: AngularFireDatabase, private manageUserService: ManageUserService) { }

  ngOnInit() {
    this.getUsersList();
  }
  getUsersList() {

    this.supplierService.getUsersByOption(this.checkChild, this.checkValue).snapshotChanges().pipe(
      map(changes =>
        changes.map(c => ({ key: c.payload.key, ...c.payload.val() }))
      )
    ).subscribe(users => {
      this.users = users;

    });

  }

  deleteOneUser(key, email) {
    this.supplierService.deleteUser(key);
  }
}



