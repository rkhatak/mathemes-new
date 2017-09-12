import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { MainService } from '../main.service';
import { Globals } from '../globals';

declare var $: any;
function windowRef(): any {
  return window;
}
@Component({
  selector: 'app-login-source',
  templateUrl: './login-source.component.html',
  styleUrls: ['./login-source.component.css']
})
export class LoginSourceComponent implements OnInit {
  public toLoginUser: boolean = true;
  public forgotSuccess: boolean = false;
  constructor(private mservice: MainService, public globals: Globals) { }

  ngOnInit() {
  }
  forgotPassword() {
    this.toLoginUser = false;
  }
  backToLogin() {
    this.toLoginUser = true;
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

  forgotPassSubmit() {
    let self = this;
    $(".invalid-forgotpass").addClass('hide');
    $("#invalid-forgotpass").html('');
    var resData = this.globals.currentRestaurantDetail;
    var hasError = this.mservice.validateEmailNow('forgot_email', 'user_forgotemail_error');
    if (hasError) {
      return false;
    }
    resData.address = resData.address + ', ' + resData.city + ', ' + resData.zipcode;
    var hostName = window.location.href;
    var data = {
      host_name: hostName, email: $.trim($("#forgot_email").val()), token: this.mservice.getStorage('oauth.token'), restaurant_id: resData.id, restaurant_name: resData.name, restaurant_address: resData.address, base_url: resData.base_url,
      facebook_url: resData.facebook_url, gmail_url: resData.gmail_url, twitter_url: resData.twitter_url, instagram_url: resData.instagram_url, restaurant_logo: resData.restaurant_logo_name
    };
    this.mservice.forgotPass(data).subscribe((data) => {
      self.forgotSuccess = true;
    }, (err) => {
      let errObj = JSON.parse(err._body);
      let msg = errObj.error;
      $(".invalid-forgotpass").removeClass('hide');
      $("#invalid-forgotpass").html(msg).fadeIn("slow").removeClass("hide");
    })
  }

  login = function () {
    let self = this;
    var hasError = this.mservice.validateEmailNow('user_email', 'user_email_error');
    var hasError1 = this.mservice.validatePassword('user_password', 'user_password_error');
    if (hasError || hasError1) {
      return false;
    }
    let data = { 'email': $.trim($("#user_email").val()), 'password': $.trim($("#user_password").val()), 'token': self.mservice.getStorage('oauth.token'), 'type': 'normal' };
    self.mservice.login(data).subscribe((res) => {
      self.mservice.setLocation().subscribe(() => {
        self.mservice.getUserDetails()
          .subscribe(
          (udata) => self.setUserDetails(udata));
      })
    }, (err) => {
      let errObj = JSON.parse(err._body);
      let msg = errObj.error;
      $(".invalid-login").removeClass('hide');
      $("#invalid-login").html(msg).fadeIn("slow").removeClass("hide");
    });
  };


}
