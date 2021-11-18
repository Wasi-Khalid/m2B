import { Injectable } from "@angular/core";
import 'rxjs/add/operator/toPromise';
import { AngularFirestore } from 'angularfire2/firestore';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from "./auth.service";
// import firebase from '@firebase/app';

@Injectable()
export class UserService implements CanActivate {

  constructor(
    public db: AngularFirestore,
    public afAuth: AngularFireAuth,
    public auth: AuthService,
    private router: Router,
  ) {
  }
  canActivate(): boolean {

    if (this.auth.isAuthenticated()) {
      this.router.navigate(['/home/products']);
      return false;
    }
    return true;
  }


}
