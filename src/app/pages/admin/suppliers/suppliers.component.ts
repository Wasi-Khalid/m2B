import { Component, OnInit } from '@angular/core';
import { SupplierService } from '../../../services/supplier.service';
import { map } from 'rxjs/operators';
import { ManageUserService } from '../../../services/manage-user.service';


@Component({
  selector: 'app-suppliers',
  templateUrl: './suppliers.component.html',
  styleUrls: ['./suppliers.component.css']
})
export class SuppliersComponent implements OnInit {

  users: any;
  constructor(private supplierService: SupplierService) { }
 
  ngOnInit() {
    this.getUsersList();

  }

  getUsersList() {
    // Use snapshotChanges().map() to store the key
    this.supplierService.getUsersList().snapshotChanges().pipe(
      map(changes =>
        changes.map(c => ({ key: c.payload.key, ...c.payload.val() }))
      )
    ).subscribe(users => {
      this.users = users;

    });
  }
// 
  deleteOneUser(key: string) {
    this.supplierService.deleteUser(key);

  }

}
