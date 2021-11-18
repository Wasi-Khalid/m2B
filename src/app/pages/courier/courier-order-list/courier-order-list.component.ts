import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-courier-order-list',
  templateUrl: './courier-order-list.component.html',
  styleUrls: ['./courier-order-list.component.css']
})
export class CourierOrderListComponent implements OnInit {
  zoom = 8;
  lat = 30.3753;
  lng = 69.3451;
  constructor() { }

  ngOnInit() {
  }

}
