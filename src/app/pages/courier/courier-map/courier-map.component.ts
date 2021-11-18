import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-courier-map',
  templateUrl: './courier-map.component.html',
  styleUrls: ['./courier-map.component.css']
})
export class CourierMapComponent implements OnInit {
  zoom = 5;
  lat = 40.7128;
  lng = 74.0060;

  constructor() { }

  ngOnInit() {
  }

}
