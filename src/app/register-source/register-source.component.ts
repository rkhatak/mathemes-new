import { Component, OnInit } from '@angular/core';
import { MainService } from '../main.service';
import { Globals } from '../globals';

declare var $: any;
function windowRef(): any {
  return window;
}

@Component({
  selector: 'app-register-source',
  templateUrl: './register-source.component.html',
  styleUrls: ['./register-source.component.css']
})
export class RegisterSourceComponent implements OnInit {

  constructor(private mservice: MainService, public globals: Globals) { }

  ngOnInit() {
  }
   userRegister(){
    this.globals.dialogType="register";
    this.globals.onDialogSet();
  }
  userlogin(){
    this.globals.dialogType="login";
    this.globals.onDialogSet();
  }

  fbLogin() {
    this.mservice.facebookRegister();
    this.openPopup();
  }

  gpLogin() {
    this.mservice.googlePlusRegister();
    this.openPopup();
  }
  twLogin() {
    this.mservice.twitterRegister();
    this.openPopup();
  }
  openPopup() {
    $('#r_inactive_user').addClass('hide');
    let _this = this;
    let selfWindow = windowRef();
    selfWindow.closeCallbackError = function () {
      _this.resgisterFalse.call(_this);
    };
    selfWindow.closeCallbackFunction = function () {
      _this.resgisterSocial.call(_this);
    };
    selfWindow.closeCallbackFunctionForTwitter = function () {
      _this.resgisterTwitterSocial.call(_this);
    };

  }

  resgisterFalse() {
    $('#r_inactive_user').removeClass('hide').html('Inactive user Please login with other credentials');
  }
  resgisterSocial() {
    this.mservice.getUserDetails()
      .subscribe(
      (udata) => this.setUserDetails(udata));
  }
  resgisterTwitterSocial() {
    this.mservice.getUserDetails()
      .subscribe(
      (udata) => this.setTwitterUserDetails(udata));
  }
  setTwitterUserDetails(d) {
    if (d.email !== '') {
      this.globals.currentUser = d;
      this.globals.onThemeSet();
      this.mservice.hidePopUp();
    } else {
      this.globals.dialogType = 'twitterlogin';
      this.globals.onDialogSet();
    }

  }
  setUserDetails(d) {
    this.globals.is_login = true;
    this.globals.currentUser = d;
    this.globals.onThemeSet();
    this.mservice.setStorage('is_login', true);
    this.mservice.hidePopUp();
  }

}
