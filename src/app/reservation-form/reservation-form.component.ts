import { Component, OnInit,ChangeDetectorRef,Input} from '@angular/core';
import {Globals} from '../globals';
import { MainService } from '../main.service';

@Component({
  selector: 'app-reservation-form',
  templateUrl: './reservation-form.component.html',
  styleUrls: ['./reservation-form.component.css'],
  inputs: ['_data']
})
export class ReservationFormComponent implements OnInit {
  myDate =new Date();
  isReservationTime:boolean=true;
  isShowReservation:boolean=false;
  currentRestaurant="";
  _dataDefault:any;
  redata = {
                first_name_r : "",
                last_name_r:"",
                email_r:"",
                phone_no_r:""
            }

  constructor(public globals:Globals,private changeDetectorRef:ChangeDetectorRef,private mservice: MainService) { 
    this.myDate=new Date();
  }
  
  public set _data(values) {
    if (!values)
      return;
    this.isShowReservation = values.isShowReservation;
    this.isReservationTime = values.isReservationTime;
  }

  ngOnInit() {
    this._dataDefault=this._data;
  }
  updateCalcs(event){
    console.log(event);
  }
hideReservationForm(){
  this.isShowReservation = false;
  this.isReservationTime = true;
  this.changeDetectorRef.detectChanges();
}
sendReservation() {
            this.mservice.reserveTableNow('2017-09-15');
        }
showReservationForm () {
            this.isShowReservation = true;
            this.isReservationTime = false;
            this.currentRestaurant=this.globals.currentRestaurantDetail;
            if(this.globals.is_login){
            this.redata.first_name_r = this.globals.currentUser.first_name;
            this.redata.last_name_r = this.globals.currentUser.last_name;
            this.redata.email_r = this.globals.currentUser.email;
            this.redata.phone_no_r = this.globals.currentUser.phone;
          }
          this.changeDetectorRef.detectChanges();
        }

}
