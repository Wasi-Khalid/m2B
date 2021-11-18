import { Injectable } from '@angular/core';
import { CanActivate, Router, RouterStateSnapshot, ActivatedRouteSnapshot } from "@angular/router";
import { AngularFireAuth } from 'angularfire2/auth';
import { UserService } from '../core/user.service';
import { AuthService } from './auth.service';
import * as firebase from 'firebase';

@Injectable()
export class AuthGuard implements CanActivate {
  isLoggin: boolean;
  localStorageData: string;
  constructor(
    public afAuth: AngularFireAuth,
    public userService: UserService,
    private router: Router,
    public auth: AuthService
  ) { }

  canActivate(): boolean {

    if (!this.auth.isAuthenticated()) {
      localStorage.clear();
      this.router.navigate(['/auth']);
      return false;
    }

    return true;
  }


}
