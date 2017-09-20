import { Component, Input, OnInit, OnDestroy, Inject,ViewChild,ChangeDetectorRef} from '@angular/core';
import { MainService } from '../main.service';
import { Globals } from '../globals';
import { Subscription } from 'rxjs/Subscription';
import { DOCUMENT } from '@angular/platform-browser';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';
import { PageScrollConfig, PageScrollService, PageScrollInstance } from 'ng2-page-scroll';
import {CartTimeComponent} from '../cart-time/cart-time.component';
import { Router } from '@angular/router';
import * as _ from 'underscore';
declare var $: any;


@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit, OnDestroy {

  constructor(private changeDetectorRef:ChangeDetectorRef,private router:Router,private mservice: MainService, public globals: Globals, @Inject(DOCUMENT) private document: any, public sanitizer: DomSanitizer,private pageScrollService: PageScrollService) {
       this.onCartItemChange$Subscription = this.globals.onCartItemChange.subscribe(
          () => {
          this.cartItemDisplay= this.globals.cartItemDisplay;
          this.cartItems=this.globals.cartItems;
          this.setDeliveryAddress=this.globals.setDeliveryAddress;
          this.deliveryOrderCart=this.globals.deliveryOrderCart;
          this.changeDetectorRef.detectChanges();
          }
        );
    
   }
  public dishes: any;
  private restaurantDeal: object;
  public order_type: any;
  public deliveryOrderCart: boolean = false;
  addonsDisplay = false;
  addcart = false;
  private imagePath: string;
  cart:any;
  items:any;
  onThemeSetEvent$Subscription: Subscription;
  onCartItemChange$Subscription:Subscription;
  cartItems:any;
  cartItemDisplay:boolean;
  cartLenth:boolean;
  searchAddress:any;
  setDeliveryAddress:any;
  globalObj:any;
  menuDeals:boolean=false;
  flag:boolean=false;
  deliveryIns:boolean=false;
 takeoutIns:boolean=false;
 public checkoutAddress:any;
  public checkoutAddressData:any;
  @ViewChild(CartTimeComponent) timeChild:CartTimeComponent;
 

  
  ngOnInit() {
    if (this.globals.globalRestaurantId) {
      this.getMenu();
      this.getDeals();
    } else {
      if (!this.onThemeSetEvent$Subscription) {
        this.onThemeSetEvent$Subscription = this.globals.onThemeSetEvent.subscribe(
          (data) => {
            this.getMenu();
            this.getDeals();
            
          }
        );
      }
    }
  }

  ngOnDestroy() {
    if (this.onThemeSetEvent$Subscription) {
      this.onThemeSetEvent$Subscription.unsubscribe();
    }
    if(this.onCartItemChange$Subscription){
      this.onCartItemChange$Subscription.unsubscribe();
    }
  }

  private getMenu() {
    let _currentRestId = this.globals.globalRestaurantId;
    let _menu=(this.mservice.getStorage('order_items_'+_currentRestId))?JSON.parse(this.mservice.getStorage('order_items_'+_currentRestId)):[];
    this.cartItems=(this.cartItems)?this.cartItems:_menu;
    this.order_type=(this.mservice.getStorage(`order_type_${_currentRestId}`))?this.mservice.getStorage(`order_type_${_currentRestId}`):'takeout';    
    if(this.cartItems){

    if(Object.keys(this.cartItems).length>0){
      this.cartItems=this.cartItems;
      this.cartItemDisplay=true;
      this.cartLenth=true;
    }else{
      this.cartItemDisplay=false;
      this.cartLenth=false;
    }
    }else{
      this.cartItemDisplay=false;
      this.cartLenth=false;
    }
    if(this.order_type=='delivery'){
      this.getCheckDelivery();
    }else{
      this.mservice.getCheckTakeout();
    }
    this.globalObj=this.globals;
    this.mservice.setStorage('order_type_' + _currentRestId, 'takeout');
    this.mservice.getRestaurantMenu(_currentRestId)
      .subscribe(data => this.prepareMenu(data.menu));
  }
  getCheckTakeout(){
    this.mservice.getCheckTakeout();
  }
 
  private prepareMenu(m): void {
    let self=this;
    this.dishes = m;
    this.dishes.minDelivery = this.globals.currentRestaurantDetail.minimum_delivery;
    this.order_type = this.mservice.getStorage('order_type_' + this.globals.globalRestaurantId);
    this.imagePath = this.globals.currentRestaurantDetail.base_url + this.globals.currentRestaurantDetail.res_code + "/thumb/";
    setTimeout(function(){
    var el = this.document.querySelectorAll('.r_menu_navbar>li');
    el[0].classList.add('active');
    },1000);
   
  }
  getCheckDelivery() {
    let self=this;
    var restId = self.globals.globalRestaurantId;
    self.deliveryOrderCart = false;
    if (self.mservice.getStorage('can_deliver_' + restId) == null || JSON.parse(self.mservice.getStorage('can_deliver_' + restId)) !== true) {
    self.globals.dialogType = 'searchAddress';
    self.mservice.setStorage("select_delivery_" + restId, 'delivery');
    self.searchAddress = (self.mservice.getStorage('address_value_' + restId) != null) ? self.mservice.getStorage('address_value_' + restId) : '';
    $('#t_takeout').prop("checked", true);
    self.globals.onDialogSet();
    } else {
    $("#t_delivery").prop("checked", true);
    self.mservice.setStorage('order_type_' + restId, 'delivery');
    self.setDeliveryAddress = self.mservice.getStorage("address_value_" + restId);
    self.deliveryOrderCart = true;
    self.mservice.renderDateTime('delivery');
    self.mservice.cartCalution();
    self.mservice.getTipOptions();
  }
  
  
            //ga('send', 'event', 'Order Summary', 'delivery' , "Click_on_delivery_Button", 1, true);
  }
  
  private getDeals() {
    let _currentRestId = this.globals.globalRestaurantId;
    this.mservice.getRestaurantDeals(_currentRestId)
      .subscribe((data) =>{
         if(data.length>0){ 
         this.restaurantDeal = data
         this.menuDeals=true;
         }else{
          this.menuDeals=false; 
         }
        },(error)=>{
          this.menuDeals=false;
        });
  }

  isDMDeal(title) {
    if (title === "Dine & More Specials") {
      return "dmdeal";
    }
    return "";
  }
  startDate(date) {
    if (typeof date === 'string') {
      date = date.replace(/\-/g, '/');
    }
    var dateOut = new Date(date);
    return dateOut.getDate() + '/' + (dateOut.getMonth() + 1) + '/' + dateOut.getFullYear();
  }
  showTab(cid, cName) {
    var el = this.document.getElementsByClassName('tabs');
    for (var i = 0; i < el.length; i++) {
      el[i].classList.remove('deactive');
      el[i].classList.remove('active');
    }
    this.document.querySelector('.tab_' + cid).classList.add('active');
    var ml = this.document.getElementsByClassName('menu_container');
    for (var i = 0; i < ml.length; i++) {
      ml[i].style.display = "none";
    }
    this.document.querySelector('.menu_' + cid).style.display = "block";
  }

  menuImageSafe(url, image) {
    let imageFullPath = url + image;
    return this.sanitizer.bypassSecurityTrustStyle(`url('${imageFullPath}')`);
  }

  addToOrder(model){
    this.addonsDisplay = false;
    if (model.online_order_allowed == 0) {
        return false;
    }
    
    this.addcart = true;
    let restId = this.globals.globalRestaurantId;
    let order_items = <any>[];
    if (this.mservice.getStorage('order_items_' + restId) !== null) {
                if (this.mservice.getStorage('order_items_' + restId).length > 0) {
                    order_items = this.mservice.getStorage('order_items_' + restId);
                }
            }
    this.cart = model;
    this.cart.imagePath = this.imagePath;
    this.cart.quantity = 1;
    this.cart.special_instruction = "";
    this.cart.uid = model.item_id + "_" + order_items.length;
    this.cart.sub_total = 0;
    this.cart.menuPrices = model.prices[0].value;
    this.addons(model.item_id, model.prices[0].id, []);
    this.globals.cart=this.cart;
    this.globals.onCart();
    this.globals.dialogType="addtocart";
    this.globals.onDialogSet();
  }

  updateToOrder(model){
    let restId = this.globals.globalRestaurantId;
    this.cart = model;
    
    this.cart.imagePath = this.imagePath;
    let eModelAddonsLen=model.addons.length;
    let eModelAddons=model.addons;
    let AdPrice:any=0;
    if(eModelAddonsLen>0){
      for(let i=0;i<=eModelAddonsLen;i++){
        if(eModelAddons[i]){
        AdPrice+=parseFloat(eModelAddons[i]['optionPrice']);
        }
      } 
    }
    this.cart.menuPrices = model.prices[0].value;
    this.cart.sub_total = model.item_price ? model.item_price : model.prices[0].value;
    this.cart.sub_total = parseFloat(this.cart.sub_total)+ parseFloat(AdPrice);
    this.addons(model.item_id, model.price_id, model.addons);
    this.globals.cart=this.cart;
    this.globals.onCart();
    var cartCount = 0;
    var set_order_items = JSON.parse(this.mservice.getStorage('order_items_' + restId));
    if (set_order_items) {
      $.each(set_order_items, function (index, item) {
        cartCount = (cartCount + parseInt(item.quantity));
      });
    }
    this.globals.cartCount = cartCount;
    this.globals.onCartItem();

    this.globals.dialogType="addtocart";
    this.globals.onDialogSet();
  }
  addons(menuId, menuPriceId, addons){
    this.mservice.getRestaurantMenuAddons(menuId).subscribe((data)=>{
      if (data.length) {
      let dataSort= data.filter(el => el.menu_price_id == menuPriceId);
      var items = dataSort[0];
      items['selected_options'] = addons;
      this.items = items;
      this.globals.items=this.items;
      this.addonsDisplay = true;
      this.globals.addonsDisplay=true;
      this.globals.onCart();
    }else{
      this.globals.items=[];
      this.globals.addonsDisplay=false;
      this.globals.onCart();
    }
    },(err)=>{
      this.globals.items=[];
      this.globals.addonsDisplay=false;
      this.globals.onCart();
    })

  }
  cartLenthMinOrder:boolean=false;
  checkOut(e) {
    e.preventDefault();
             let self=this; 
             let restId = this.globals.globalRestaurantId;
             let _currentRest = this.globals.currentRestaurantDetail;
             if ((self.mservice.getStorage('order_type_' + restId) == 'delivery' && JSON.parse(self.mservice.getStorage('can_deliver_' + restId)) == false) || (self.mservice.getStorage('order_type_' + restId) === 'delivery' && self.mservice.getStorage('can_deliver_' + restId) === null)) {
                self.mservice.setStorage("select_delivery_" + restId, 'delivery');
                self.globals.dialogType = 'searchAddress';
                self.searchAddress = (self.mservice.getStorage('address_value_' + restId) != null) ? self.mservice.getStorage('address_value_' + restId) : '';
                self.globals.onDialogSet();
            }else {
              let _menu=(self.mservice.getStorage('order_items_' + restId))?JSON.parse(self.mservice.getStorage('order_items_' + restId)):[];
                if (_menu.length == 0) {
                    self.cartLenth=false;
                    $(".t-no-order").css('border','solid 1px red');
                    return false;
                }
                if (this.checkoutValidate() == false) {
                    self.timeChild.toolTipOpen();
                    return false;
                }
                if ((self.mservice.getStorage('order_type_' + restId) === 'delivery') && (parseFloat(self.mservice.getStorage('order_subtotal_' + restId)) < parseFloat(_currentRest.minimum_delivery))) {
                    self.cartLenthMinOrder=true;
                    $(".t-min-order").css('border','solid 1px red');
                    return false;
                }  
               this.router.navigate(['/checkout']);
            }
            
        }

checkoutValidate() {
            let self=this; 
            let restId = this.globals.globalRestaurantId;
            var flag=false;
            if (self.mservice.getStorage('order_type_' + restId) == 'delivery' && (self.mservice.getStorage('delivery_order_date_' + restId) !== "" && self.mservice.getStorage('delivery_order_time_' + restId !== "") && self.mservice.getStorage('address_value_' + restId) !== "") || (self.mservice.getStorage('delivery_order_date_' + restId) !== null && self.mservice.getStorage('delivery_order_time_' + restId) !== null && self.mservice.getStorage('address_value_' + restId) !== null)) {
                flag = true;
                self.deliveryIns=true;
            }
            if (self.mservice.getStorage('order_type_' + restId) == 'takeout' && (self.mservice.getStorage('takeout_order_date_' + restId) !== "" && self.mservice.getStorage('takeout_order_time_' + restId) !== "") && (self.mservice.getStorage('takeout_order_date_' + restId) !== null && self.mservice.getStorage('takeout_order_time_' + restId) !== null)) {
                flag = true;
                self.takeoutIns=true;
            }
            return flag;
        };
 editAddress(add){
  this.globals.dialogType="searchAddress";
  this.globals.onDialogSet({'setDeliveryAddress':add});
 }

}
