import { Component, OnInit } from '@angular/core';
import { SupplierService } from '../../../services/supplier.service';
import { map } from 'rxjs/operators';
import { AuthService } from '../../../authentication/core/auth.service';

@Component({
  selector: 'app-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.css']
})
export class SideNavComponent implements OnInit {
  option: string;
  isSupplierProduct: boolean;
  localStorageData: any;

  constructor(private supplierService: SupplierService, private authService: AuthService) { }

  ngOnInit() {
    this.localStorageData = JSON.parse(localStorage.getItem("user"));

    this.getUserOption()
    console.log(this.localStorageData);
    console.log(this.option);
  }
  getUserOption() {

    this.supplierService.getUsersByOption("email", this.localStorageData.email).snapshotChanges().pipe(
      map(changes =>
        changes.map(c => ({ key: c.payload.key, ...c.payload.val() }))
      )
    ).subscribe(users => {
      this.option = users[0].option;
      if (this.option == 'Supplier') {
        this.isSupplierProduct = false;
      } else {
        this.isSupplierProduct = true;
      }
    });

  }
}
