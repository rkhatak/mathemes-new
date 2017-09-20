import { Component, OnInit, ChangeDetectorRef, Input } from '@angular/core';
import { Globals } from '../globals';
import { MainService } from '../main.service';
declare var $: any;

@Component({
  selector: 'app-reservation-form',
  templateUrl: './reservation-form.component.html',
  styleUrls: ['./reservation-form.component.css'],
  inputs: ['_data']
})
export class ReservationFormComponent implements OnInit {
  myDate = new Date();
  _defaultReserveSeat:number=2;
   _defaultReserveTime:any="";
  isReservationTime: boolean = true;
  isShowReservation: boolean = false;
  currentRestaurant = "";
  _dataDefault: any;
  redata = {
    first_name_r: "",
    last_name_r: "",
    email_r: "",
    phone_no_r: ""
  }

  constructor(public globals: Globals, private changeDetectorRef: ChangeDetectorRef, private mservice: MainService) {
    let self = this;
    this.myDate = new Date();
  }

  public set _data(values) {
    if (!values)
      return;
    this.isShowReservation = values.isShowReservation;
    this.isReservationTime = values.isReservationTime;
  }

  ngOnInit() {
    this._dataDefault = this._data;
  }
  formetDate:any="";
  dateDetect(date) {
    this.formetDate = this.mservice.formatDate(date);
    this.mservice.populateTime(this.formetDate);
  }
  addClass(){
    $('.popup_reservetable').toggleClass('ofa');
  }
  setReserveSeat(e){
    this._defaultReserveSeat=e.currentTarget.value;
    this.changeDetectorRef.detectChanges();
  }
  showTimeSlot() {
            if ($('#timepicker1').hasClass('active')) {
                $('.timepicker_custom').hide();
                $('#timepicker1').removeClass('active');
            } else {
                $('#timepicker1').addClass('active');
                $('.timepicker_custom').show();
                $('.t_timepicker li').removeClass('current');
                var aa = $('#timepicker1').val();
                $('.t_timepicker li[timeslot_book="' + aa + '"]').addClass('current');
            }
        }
  hideReservationForm() {
    this.isShowReservation = false;
    this.isReservationTime = true;
    this.changeDetectorRef.detectChanges();
  }
  sendReservation() {
    this.mservice.reserveTableNow(this.formetDate,this._defaultReserveSeat,this._defaultReserveTime);
  }
  showReservationForm() {
    this.isShowReservation = true;
    this.isReservationTime = false;
   this._defaultReserveTime=$("#timepicker1").val();
    this.currentRestaurant = this.globals.currentRestaurantDetail;
    if (this.globals.is_login) {
      this.redata.first_name_r = this.globals.currentUser.first_name;
      this.redata.last_name_r = this.globals.currentUser.last_name;
      this.redata.email_r = this.globals.currentUser.email;
      this.redata.phone_no_r = this.globals.currentUser.phone;
    }
    this.changeDetectorRef.detectChanges();
  }

  calendarClick() {
            var container = $(".hasICalendar");
            container.show();
            container.removeClass("hide");
            var currentTarget = $('#calendarClick-1');
            var currentData = currentTarget.data();
            // var calendarStartDate = currentData.starttime;
            var calendarEndDate = currentData.endtime;
            var calendarTitle = currentData.title;
            var calendarDescription = currentData.description;
            var calendarLocation = currentData.location;
            $('.googleCalender').icalendar({sites: ['google', 'icalendar', 'outlook'],
                start: new Date(calendarEndDate),
                end: new Date(calendarEndDate),
                title: calendarTitle,
                description: calendarDescription,
                location: calendarLocation,
                count: 1});
            $('.googleCalender ul').addClass('unstyled');
        };
  hideReservation(){
    $(".popup_reservetable_overlay").hide();
  }

}
