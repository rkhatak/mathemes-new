import { Component, OnInit,Input } from '@angular/core';

@Component({
  selector: 'app-delivery-address',
  templateUrl: './delivery-address.component.html',
  styleUrls: ['./delivery-address.component.css'],
  inputs:['checkoutAddressData']
})
export class DeliveryAddressComponent implements OnInit {


  constructor() { }
  _checkoutAddressData:any;
  public set checkoutAddressData(values) {
    if (!values)
      return;
    
    this._checkoutAddressData = values;
    console.log(this._checkoutAddressData);
    //console.log('items values: ' + JSON.stringify(this.items1));
  }
  ngOnInit() {
  }

}
