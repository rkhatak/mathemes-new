import { Component, OnInit, OnDestroy } from '@angular/core';
import { MainService } from '../main.service';
import { Globals } from '../globals';
import { Subscription } from 'rxjs/Subscription';
function windowRef(): any {
  return window;
}
@Component({
  selector: 'app-payment-success',
  templateUrl: './payment-success.component.html',
  styleUrls: ['./payment-success.component.css']
})
export class PaymentSuccessComponent implements OnInit, OnDestroy {
  onThemeSetEventHeader$Subscription: Subscription;
  orderReceipt: any;
  currentRestaurant: any;
  constructor(public globals: Globals, private mservice: MainService) {
    if (this.globals.globalTheme) {
      this.loadTheme();

    } else {
      if (!this.onThemeSetEventHeader$Subscription) {
        this.onThemeSetEventHeader$Subscription = this.globals.onThemeSetEvent.subscribe(
          (data) => {
            this.loadTheme();
          }
        );
      }
    }
  }

  ngOnInit() {
    if (this.globals.globalTheme) {
      this.loadTheme();

    } else {
      if (!this.onThemeSetEventHeader$Subscription) {
        this.onThemeSetEventHeader$Subscription = this.globals.onThemeSetEvent.subscribe(
          (data) => {
            this.loadTheme();
          }
        );
      }
    }
  }

  loadTheme() {
    let restId = this.globals.globalRestaurantId;
    this.currentRestaurant = this.globals.currentRestaurantDetail;
    let self = this.mservice;
    self.setStorage('order_items_' + restId, []);
    //$rootScope.promocode = false;
    if (self.getStorage('order_type_' + restId) == "delivery") {
      self.setStorage("can_deliver_" + restId, true);
    } else {
      self.setStorage("can_deliver_" + restId, false);
      self.setStorage("address_value_" + restId, "");
    }
    self.setStorage("order_subtotal_" + restId, "");
    self.setStorage("order_tax_" + restId, "");
    self.setStorage("order_total_" + restId, "");
    self.setStorage("takeout_order_date_" + restId, "");
    self.setStorage("takeout_order_time_" + restId, "");
    self.setStorage("delivery_order_date_" + restId, "");
    self.setStorage("delivery_order_time_" + restId, "");
    //$.jStorage.set("order_type_" + restId, "");                            
    self.setStorage("address_lat_" + restId, "");
    self.setStorage("address_lng_" + restId, "");
    self.setStorage("address_type_" + restId, "");
    self.setStorage("address_distance_" + restId, "");
    self.setStorage('order_tip_' + restId, "");
    self.setStorage('tip_' + restId, 10);
    this.globals.cartCount = 0;
    this.globals.onCartItem();
    let res_name=this.globals.currentRestaurantDetail.name;
    let selfWindow = windowRef();
    selfWindow.ga('send', 'event', `Top Menu Bar ${res_name}`, 'Payment success Click' , 'Click_on_payment_success_in_Top_Menu', 1, true);

  }

  ngOnDestroy() {
    if (this.onThemeSetEventHeader$Subscription) {
      this.onThemeSetEventHeader$Subscription.unsubscribe();
    }
  }

}
