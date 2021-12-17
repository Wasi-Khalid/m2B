import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { AuthService } from '../../../authentication/core/auth.service';
import { AngularFireDatabase, AngularFireList, AngularFireObject } from 'angularfire2/database';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  @Input() currentAction: String;
  @Input() currentLink: string;

  @Input() previousAction: String;
  @Input() previousLink: string;

  show = false;
  cartCheck = false;
  adminShow = false;
  LSRole: string;
  isOrder = false;
  tot : any;
  @Input() menuvisible: boolean = true;
  @Output() menuvisibleChange = new EventEmitter<boolean>();
  message = false;
  selectProduct: any;
  constructor(
    private router: Router,
    public authService: AuthService,
    private location: Location,
    private db: AngularFireDatabase
    ) {
    this.tot = 0;
    let list = this.db.list('/cart');
    let t = 0;
    list.snapshotChanges().pipe(
      map(changes =>
        changes.map(c => ({ key: c.payload.key, ...c.payload.val() }))
      )
    ).subscribe(cart => {
      let luid  = localStorage.getItem('login');
      this.tot = 0;
      cart.forEach((currentValue, index) => {
        if( currentValue['uid'] && currentValue['uid'] == luid)
        { 
          this.tot = this.tot+ 1;
        }
        });
    });
    console.log("count="+this.tot);
  }

  ngOnInit() {
    if (this.router.url.includes('home/products')) {
      this.show = true;
    }

  }

  cart() {
    if (this.currentAction == "Cart") {
      this.router.navigateByUrl(this.currentLink)
    }
  }
  logout() {
    console.log(this.previousAction);
    localStorage.clear();
    this.router.navigate(['auth']);
    return false;
    /*
     if (this.previousAction == "Log Out") {
      localStorage.clear();
      this.authService.doLogout()
      this.router.navigate(['/auth/login'])
        .then((res) => {
          this.router.navigate(['/auth/login'])


        }, (error) => {
          console.log("Logout error", error);
        });
    } else {
      console.log(this.previousLink);
      this.router.navigateByUrl(this.previousLink)
    }*/
  }

  toggleMenu() {
    this.message = !this.message;
    this.menuvisibleChange.emit(this.message);
  }

}
