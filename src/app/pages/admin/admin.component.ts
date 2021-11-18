import { Component, OnInit, ViewChild } from '@angular/core';
import { SideNavComponent } from '../../common/layout/side-nav/side-nav.component';
import { Role } from '../../models/user.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  message: boolean;
  localStorageData: string;
  constructor(private router: Router) {
    this.localStorageData = localStorage.getItem("op");
  }

  ngOnInit() {
    if (this.localStorageData === Role.Business) {
      this.router.navigate(['/home/products']);
    } else if (this.localStorageData === Role.Courier) {
      this.router.navigate(['/courier-map']);
    }

  }

  receiveMessage($event) {
    this.message = $event;
  }

}
