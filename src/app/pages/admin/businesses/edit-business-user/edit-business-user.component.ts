import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import { UserModel } from '../../../../models/user.model';
import { SupplierService } from '../../../../services/supplier.service';

@Component({
  selector: 'app-edit-business-user',
  templateUrl: './edit-business-user.component.html',
  styleUrls: ['./edit-business-user.component.css']
})
export class EditBusinessUserComponent implements OnInit {
  addBusinessUserForm: FormGroup;
  option = [
    { name: 'Admin', value: 'Admin' },
    { name: 'Supplier', value: 'Supplier' },
    { name: 'Business', value: 'Business' },
    { name: 'Courier', value: 'Courier' }
  ]
  user: UserModel = new UserModel();
  id2: string;
  nameCheck: string = "okk";

  constructor(private actRoute: ActivatedRoute, private supplierSer: SupplierService,
    private router: Router,
    private fb: FormBuilder) {
    this.createForm();

    const id = this.actRoute.snapshot.queryParamMap.get('userId');  // Getting current component's id or information using ActivatedRoute service
    this.id2 = id;
    if (id !== null) {
      this.supplierSer.GetUser(id).valueChanges().subscribe(data => {

        if (this.nameCheck == "okk") {
          this.addBusinessUserForm.setValue(data); // Using SetValue() method, It's a ReactiveForm's API to store intial value of reactive for
          this.nameCheck = data.name;
        }
      })
    }
  }
  createForm() {
    this.addBusinessUserForm = this.fb.group({
      key:[''],
      userId: [''],
      name: [''],
      phoneNo: [0],
      email: [''],
      option: [''],
      address: [''],
      requestApprove: [''],
      credit: [0],
      addOn: [0],
      uid: ['']
    });
  }

  ngOnInit() {

  }

  updateForm(value: any) {

    this.user = value;
    this.user.addOn = Date.now();
    this.supplierSer.updateUser(this.id2, this.user);
  }

}
