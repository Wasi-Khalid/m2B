import { Injectable } from "@angular/core";
import 'rxjs/add/operator/toPromise';

import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase';
// import firebase from '@firebase/app';
// import { FirebaseUserModel } from '../core/user.model';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
// import * as admin from "firebase-admin";
import { UserModel } from '../../models/user.model';
import { ToastrService } from 'ngx-toastr';


@Injectable()
export class AuthService {

  public dbPath = '/users';

  usersRef: AngularFireList<UserModel> = null;
  AdminCheck = false;
  constructor(
    private toastrService: ToastrService,
    public afAuth: AngularFireAuth,
    private db: AngularFireDatabase,

  ) {
    this.usersRef = db.list(this.dbPath);
  }

  resetPassword(email: string) {

    let auth = firebase.auth();
    return auth.sendPasswordResetEmail(email)
      .then(() => console.log("email sent"))
      .catch((error) => console.log(error))
  }

  doRegister(value, user) {
    return new Promise<any>((resolve, reject) => {

      firebase.auth().createUserWithEmailAndPassword(value.email, value.password)
        .then(res => {
          //check for Business and Supplier and send email varification mail to user
          if (user.option == 'Courier' || user.option == 'Admin') {
            this.createCustomer(user)
            resolve(res);
          } else {
            let user1: any = firebase.auth().currentUser;
            user1.sendEmailVerification().then(
              (success) => {
                this.toastrService.info('Verification Email is Send!');
                this.toastrService.info('Please verify your email to complete Registeration!');
                this.createCustomer(user)
                resolve(res);
              }
            ).catch(
              (err) => {
                reject(err);
              }
            )
          }


        }, err => reject(err))
    })
  }
  createCustomer(user: UserModel): void {

    this.usersRef.push(user);
  }
  public isAuthenticated(): boolean {
    const token = localStorage.getItem('user');
    // Check whether the token is expired and return
    // true or false
    return token !== null && token !== undefined && token !== '';
  }

  doLogin(value) {
    return new Promise<any>((resolve, reject) => {
      firebase.auth().signInWithEmailAndPassword(value.email, value.password)
        .then(res => {

          resolve(res);
        }, err => reject(err))
    })
  }
  setAdminCheck() {
    this.AdminCheck = true;
  }

  doLogout() {
    this.AdminCheck = false;
    return new Promise((resolve, reject) => {
      if (firebase.auth().currentUser) {
        this.afAuth.auth.signOut()
        resolve();
      }
      else {
        reject();
      }
    });
  }
}
