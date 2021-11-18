import { Component, OnInit } from '@angular/core';
import { AuthService } from '../core/auth.service'
import { Router, Params } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoggedInAsService } from '../logged-in-as.service';

import 'rxjs/add/operator/map'
import * as firebase from 'firebase';
// import firebase from '@firebase/app';
import { SupplierService } from '../../services/supplier.service';
// import { map } from 'rxjs/add/operator/map';
import { map } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { Role } from '../../models/user.model';



@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  resetForm: FormGroup;
  errorMessage: string = '';
  queryObservable: any;
  users: any;
  checkChild = "email";
  ress: any;
  isForgetPage = false;
  forgetEmail: string;
  isEmailFind: boolean;
  allUser: any;
  constructor(
    private toastrService: ToastrService,
    public authService: AuthService,
    private router: Router,
    private fb: FormBuilder,
    private supplierService: SupplierService,
    private activeUserService: LoggedInAsService

  ) {
    this.createForm();
    this.getAllUser();


  }
  ngOnInit() {

  }
  createForm() {
    this.loginForm = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    });
    this.resetForm = this.fb.group({
      email: ['', Validators.required]
    });
  }



  checkOption(option: any) {
    this.activeUserService.setValue(option);
    if (option == 'Admin') {

      this.authService.setAdminCheck();
      this.router.navigate(['/admin']);
    } else if (option == 'Courier') {

      this.router.navigate(['/courier-map']);
    } else if (option == 'Supplier') {

      this.router.navigate(['/supplierHome']);
    } else if (option == 'Business') {

      this.router.navigate(['/home/products']);
    }

  }

  GetOption(data) {

    if (data == 'Admin') {
      return Role.Admin;
    } else if (data == 'Courier') {
      return Role.Courier;
    } else if (data == 'Supplier') {
      return Role.Supplier;
    } else if (data == 'Business') {
      return Role.Business;
    } else {
      return '0';
    }

  }
  forgetPageSetup() {
    this.isForgetPage = !this.isForgetPage;
  }

  resetPassword(value) {

    this.allUser.forEach((user) => {
      if (user.email === value.email) {
        this.isEmailFind = true;
      }
    })

    if (this.isEmailFind) {
      this.authService.resetPassword(value.email)
        .then(() => {
          this.toastrService.success('Sent Password Reset Email! Check Your Email!');
          this.isForgetPage = false;
        })
        .catch((error) => this.toastrService.error(error));
    } else {
      this.toastrService.error("Your Email is Not found! Plaese Singn Up First!")
    }


  }
  getAllUser() {
    this.supplierService.getUsersList().snapshotChanges().pipe(
      map(changes =>
        changes.map(c => ({ key: c.payload.key, ...c.payload.val() }))
      )
    ).subscribe(users => {
      this.allUser = users

    });

  }
  tryLogin(value) {

    this.authService.doLogin(value)
      .then(res => {
        this.supplierService.getUsersByOption(this.checkChild, value.email.toLowerCase()).snapshotChanges().pipe(
          map(changes =>
            changes.map(c => ({ key: c.payload.key, ...c.payload.val() }))
          )
        ).subscribe(users => {
          console.log("Login user here");
          localStorage.setItem("login", users[0].key);
          this.users = users;
          this.activeUserService.setValue(this.users[0].option);
          this.ress = this.GetOption(this.users[0].option);
          localStorage.setItem("op", this.ress);
          this.checkOption(this.users[0].option);

          //check for Business and Supplier and check email varification if not then send email varification mail to user
          if (this.ress == Role.Courier || this.ress == Role.Admin) {
            localStorage.setItem("user", JSON.stringify(res));
          } else {
            if (this.ress == Role.Supplier) {
              if (res.emailVerified === true && this.users[0].requestApprove == "1") {
                localStorage.setItem("user", JSON.stringify(res));
              } else if (this.users[0].requestApprove == "0") {
                this.toastrService.info('Your Request is Not Approved By Admin!');
              } else {
                res.sendEmailVerification().then(
                  (success) => {
                    this.toastrService.info('Please verify your email first and Try Again!');
                    this.authService.doLogout();
                  }
                ).catch(
                  (err) => {
                    this.toastrService.error("Check Your Email and Please verify your email first then Try Again! ");
                    this.toastrService.error(err);
                  })

              }
            } else {
              if (res.emailVerified === true) {
                localStorage.setItem("user", JSON.stringify(res));
              } else {
                res.sendEmailVerification().then(
                  (success) => {
                    this.toastrService.info('Please verify your email first and Try Again!');
                    this.authService.doLogout();
                  }
                ).catch(
                  (err) => {
                    this.toastrService.error("Check Your Email and Please verify your email first then Try Again! ");
                    this.toastrService.error(err);
                  })
              }

            }
          }
        });

      }, err => {
        alert("error");
        console.log(err);
        this.errorMessage = err.message;
      });

  }
}
