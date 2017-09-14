import { Component, OnInit } from '@angular/core';
import { DatePickerOptions, DateModel } from 'ng2-datepicker';

@Component({
  selector: 'app-reservation-form',
  templateUrl: './reservation-form.component.html',
  styleUrls: ['./reservation-form.component.css']
})
export class ReservationFormComponent implements OnInit {
  date: DateModel;
  options: DatePickerOptions;
  myDate =new Date();
  constructor() { 
    this.options = new DatePickerOptions();
    this.myDate=new Date();
  }
 
  ngOnInit() {
  }

}
