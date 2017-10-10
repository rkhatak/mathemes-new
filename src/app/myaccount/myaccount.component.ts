import { Component, OnInit,OnDestroy,ChangeDetectorRef } from '@angular/core';
import {MainService} from '../main.service';
import { Globals } from '../globals';
import {Subscription} from 'rxjs/Subscription';
import { Router } from '@angular/router';
function windowRef(): any {
  return window;
}
@Component({
  selector: 'app-myaccount',
  templateUrl: './myaccount.component.html',
  styleUrls: ['./myaccount.component.css']
})
export class MyaccountComponent implements OnInit,OnDestroy {
  onThemeSetEvent$Subscription: Subscription;
  constructor(private router:Router,private mservice:MainService,public globals: Globals,private changeDetectorRef:ChangeDetectorRef) { }
  redeemable_point:any = 0;
  redeemed_point:any = 0;
  total_point:any = 0;
  restID:any = 0;
  cash:any = 0;
  liveList:any="" ;
  archiveList:any="";
  sendToPop:any;
  
  ngOnInit() {
    
    if(this.globals.globalRestaurantId){
      this.getData();
    }else{
    if(!this.onThemeSetEvent$Subscription){
      this.onThemeSetEvent$Subscription = this.globals.onThemeSetEvent.subscribe(
        () => {
           this.getData();
        }
      );
    }
    }

  }
getData(){
  console.log(this.globals.is_login);
  if(this.globals.is_login==false){
    this.router.navigate(['/home']);
  }
  this.restID=this.globals.globalRestaurantId;
  this.mservice.getPointDetails('points').subscribe((data) =>this.setData(data));
  this.mservice.getOrderlist('live',this.restID).subscribe((data) =>this.liveList=data);
  this.mservice.getOrderlist('archive',this.restID).subscribe((data) =>this.archiveList=data);
  let res_name=this.globals.currentRestaurantDetail.name;
  let selfWindow = windowRef();
  selfWindow.ga('send', 'event', `Top Menu Bar ${res_name}`, 'My account Click' , 'Click_on_my_account_in_Top_Menu', 1, true);
}
  ngOnDestroy(){
    if(this.onThemeSetEvent$Subscription){
      this.onThemeSetEvent$Subscription.unsubscribe();
    }
  }  
  setData(d){
    this.globals.redeemable_point=this.redeemable_point = d.points - d.redeemed_points;
    this.redeemed_point = d.redeemed_points;
    this.total_point= d.points;
    this.cash = d.points * .01 ;
    
  }
  getActivityArchive(){
    this.globals.dialogType="myActivity";
    this.globals.onDialogSet();
  }
  viewOrder(id){
    this.globals.dialogType="orderDetail";
    this.globals.onDialogSet({'id':id});
  }
  reOrder(id){
    this.mservice.getReOrderDetails(id).subscribe((data) =>this.setReData(data));
  }
  setReData(data){
    if(typeof data.data=="undefined"){
      var order = data;
      order.order_type = (order.order_type).toLowerCase();
      if (order.order_details.length > 0) {
          this.mservice.setStorage('order_type_' + order.restaurant_id, order.order_type);
          this.mservice.setStorage('delivery_order_date_' + order.restaurant_id, '');
          this.mservice.setStorage('delivery_order_time_' + order.restaurant_id, '');
          this.mservice.setStorage('order_items_' + order.restaurant_id, []);
          var order_items = [];
          var orderP = 0;
          var addons = [];
           for (let v of order.order_details) {
      
              if (v.addon.length > 0) {
                
                    for (let a of v.addon) {
                      var addon = {
                          "name": a.addon_name,
                          "menuPriceId": a.menu_addons_id,
                          "priority": a.addon_quantity,
                          "optionName": a.addon_name,
                          "addonId": a.menu_addons_id,
                          "optionPrice": a.addon_price,
                          "optionId": a.menu_addons_option_id,
                          "addonName": a.addon_name,
                          "label": a.addon_name,
                          "freeAddons": a.was_free
                      };
                      addons.push(addon);
                  };
              }

              var items = {
                  "uid": v.id,
                  "id": order.order_details.length,
                  "item_id": v.item_id,
                  "item_image_url": "",
                  "item_name": v.item,
                  "item_desc": v.item_price_desc,
                  "quantity": v.quantity,
                  "price_id": v.item_price_id,
                  "item_price": v.unit_price,
                  "sub_total": v.total_price,
                  "total_item_price": v.total_item_amt,
                  "special_instruction": v.special_instruction,
                  "addons": addons
              };
              orderP += v.total_item_amt;
              order_items.push(items);
          };
          this.mservice.setStorage('order_items_' + order.restaurant_id, JSON.stringify(order_items));
          this.mservice.setStorage('order_subtotal_' + order.restaurant_id, orderP);
          this.mservice.setStorage('order_tax_' + order.restaurant_id, order.tax);
          if (order.order_type === "takeout") {
              this.mservice.setStorage('can_deliver_' + order.restaurant_id, null);
          } else { 
              this.mservice.setStorage('can_deliver_' + order.restaurant_id, true);
          }
          this.mservice.setStorage('address_value_' + order.restaurant_id, order.address + ", " + order.city_name + ", " + order.state_code + ", " + order.zipcode);
          this.mservice.setStorage('address_lat_' + order.restaurant_id, this.globals.currentRestaurantDetail.latitude);
          this.mservice.setStorage('address_lng_' + order.restaurant_id, this.globals.currentRestaurantDetail.longitude);
          this.mservice.setStorage('address_type_' + order.restaurant_id, '');
          this.mservice.setStorage('address_distance_' + order.restaurant_id, '');
          this.mservice.setStorage('order_tip_' + order.restaurant_id, order.tip_amount);
          var total = order.tax + orderP + order.tip_amount;
          this.mservice.setStorage('order_total_' + order.restaurant_id, total);
          this.mservice.setStorage('tip_' + order.restaurant_id, order.tip_percent);
          this.mservice.setStorage('navigate_reorder_' + order.restaurant_id,'menu');
      } 
      console.log(order_items);
      this.router.navigate(['/menu']);
    }
  }
}
