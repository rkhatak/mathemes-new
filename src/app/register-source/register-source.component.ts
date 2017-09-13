import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
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

  constructor(private mservice: MainService, public globals: Globals, private changeDetectorRef: ChangeDetectorRef) { }
  public capcha: any = "";
  ngOnInit() {
    this.mservice.getCapcha().subscribe((data) => {
      this.capcha = data.captcha_item;
      this.changeDetectorRef.detectChanges();
    }, (err) => {
      this.capcha = "";
    })
  }
  userRegister() {
    this.globals.dialogType = "register";
    this.globals.onDialogSet();
  }
  userlogin() {
    this.globals.dialogType = "login";
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
  normalRegister() {
    let self = this;
    $(".error-invalid-register").addClass('hide');
    let resData = this.globals.currentRestaurantDetail;
    let loyality_code = this.globals.loyalty_code;
    var hasError1 = this.mservice.validateField('first_name', 'r_error_user_name');
    if (hasError1 == false) {
      $('.r_error_user_name').addClass('hide');
    }
    var hasError2 = this.mservice.validateEmailNow('email_signup', 'r_error_email');
    if (hasError2 == false) {
      $('.r_error_email').addClass('hide');
    }
    var hasError3 = this.mservice.validatePassword('password_signup', 'r_error_password');
    if (hasError3 == false) {
      $('.r_error_password').addClass('hide');
    }
    var hasError4 = this.mservice.validateField('r_captcha', 'r_error_capcha_filter');
    if (hasError4 == false) {
      $('.r_error_capcha_filter').addClass('hide');
    }

    if ($.trim($('#r_captcha').val()) != "" && ($.trim($('#r_capcha_filter').html()) != $.trim($('#r_captcha').val()))) {
      $('.r_error_capcha_filter').removeClass('hide');
      $('.r_error_capcha_filter').html('Please enter the number as displayed');
      return false;
    }

    if (hasError1 || hasError2 || hasError3 || hasError4) {
      return false;
    }
    var fName = $.trim($('#first_name').val());
    var lName = $.trim($('#last_name').val());
    var email = $.trim($('#email_signup').val());
    var password = $.trim($('#password_signup').val());
    var user_source = "ws";
    resData.address = resData.address + ', ' + resData.city + ', ' + resData.zipcode;
    var hostName = window.location.href;
    var data = {
      loyality_code: loyality_code, host_name: hostName, first_name: fName, last_name: lName, email: email, user_source: user_source,
      password: password, is_logged_in: false, captcha: $.trim($('#r_captcha').val()), token: this.mservice.getStorage('oauth.token'),
      accept_toc: true, restaurant_id: resData.id, restaurant_name: resData.name, restaurant_address: resData.address, base_url: resData.base_url,
      facebook_url: resData.facebook_url, gmail_url: resData.gmail_url, twitter_url: resData.twitter_url, instagram_url: resData.instagram_url, restaurant_logo: resData.restaurant_logo_name
    };
    $('.register_loader').removeClass('hide');
    this.mservice.newRegister(data).subscribe((res) => {
      self.mservice.setLocation().subscribe(() => {
        self.mservice.getUserDetails()
          .subscribe(
          (udata) => self.setUserDetails(udata));
          $('.register_loader').addClass('hide');
      });
    }, (err) => {
      let errObj = JSON.parse(err._body);
      let msg = errObj.error;
      $('.register_loader').addClass('hide');
    })
    // var url = homeService.postApiUrl('user/details');
    // serverUtilityService.postWebService(url, data)
    //         .then(function (data) {
    //             var msg = "";

    //             if (typeof data.data !== "undefined" && typeof data.data.error !== "undefined") {
    //                 msg = data.data.error;
    //                 $(".error-invalid-register").removeClass('hide');
    //                 $(".error-invalid-register").html(msg).fadeIn("slow");
    //                 $('.register_loader').addClass('hide');
    //             } else {
    //                 var url = homeService.getApiUrl('user/details');
    //                 serverUtilityService.getWebService(url)
    //                         .then(function (data) {
    //                             $scope.currentUser = data;
    //                             $rootScope.formData.name = $scope.currentUser.first_name;
    //                             $rootScope.formData.lastName = $scope.currentUser.last_name;
    //                             $rootScope.formData.email = $scope.currentUser.email;
    //                             $rootScope.formData.phone = $scope.currentUser.phone;
    //                         });
    //                 serverUtilityService.popuphide();
    //                 $rootScope.is_logged_in = true;
    //                 $.jStorage.set("isloggedin", true);
    //                 $('.register_loader').addClass('hide');
    //             }

    //         });
  }

}
