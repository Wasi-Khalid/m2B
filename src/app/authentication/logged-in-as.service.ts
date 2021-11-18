import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase';
// import firebase from '@firebase/app';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';

@Injectable()
export class LoggedInAsService {
  option: String;

  private userLoggedIn = new BehaviorSubject<string>('');
  currentValue = this.userLoggedIn.asObservable();
  setValue(user) {
    this.option = user;
    this.userLoggedIn.next(user);
  }
  constructor(private _firebaseAuth: AngularFireAuth, private router: Router) {

  }

}
