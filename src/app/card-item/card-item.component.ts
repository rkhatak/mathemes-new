import { Component, OnInit, Input, OnDestroy, Inject } from '@angular/core';
import { Globals } from '../globals';
import { Subscription } from 'rxjs/Subscription';
import { DOCUMENT } from '@angular/platform-browser';
import { MainService } from '../main.service';
import * as _ from 'underscore';

declare var $: any;

@Component({
  selector: 'app-card-item',
  templateUrl: './card-item.component.html',
  styleUrls: ['./card-item.component.css']
})
export class CardItemComponent implements OnInit, OnDestroy {

  cart: any;
  addonsDisplay: boolean;
  sub_total = 0;
  total = 0;
  items: any;
  addonSelected: any;
  cartItems: any;
  cartItemDisplay: boolean = false;
  date: any;
  time: any;
  selectedDate: any;
  selectedTime: any;
  dates: any;
  timeEdit: boolean;
  order_type: string = 'takeout';
  private onCartChange$Subscription: Subscription;
  constructor(public mservice: MainService, private globals: Globals, @Inject(DOCUMENT) private document: any) {
    this.onCartChange$Subscription = this.globals.onCartChange.subscribe(() => {
      this.cart = this.globals.cart;
      //console.log(this.cart);
      this.items = this.globals.items;
      this.addonsDisplay = this.globals.addonsDisplay;
      this.sub_total = this.cart.sub_total ? this.cart.sub_total : this.cart.prices[0].value;
      this.total = this.sub_total * this.cart.quantity;
      this.total = (100 * this.total / 100);
    })
  }
  changeItemPrice(){
    let restId = this.globals.globalRestaurantId;
    let newVal =  ($(".y_price_select option:selected").attr('priceattr')).split("-"); 
    let menuId=$.trim($('#item_id').val());
    $("#price_id").val(newVal[0]);
    $("#item_price").val(newVal[1]);
    $("#price_desc").val(newVal[2]);
    this.cart.menuPrices=newVal[1]  ;
    this.globals.cart.menuPrices=this.cart.menuPrices;
    this.globals.onCart();
    let id = $("#uid").val(),addons=[];
    let order_items =JSON.parse(this.mservice.getStorage('order_items_'+restId));
    if(order_items.length>0){
            let arIndex=0;
            for(let i=0;i<order_items.length;i++){
              if(order_items[i].uid==id){
                arIndex=i;
              }
            }
            var model =_.find(order_items, function(el:any) { return el.uid === id; });
            order_items.splice(arIndex,1);
            
            if(model){
              _.each(model,function(i,v){
                model['item_price']=newVal[1];
                model['price_id']=newVal[0];
                model['price_desc']=newVal[2];
              })
              order_items.push(model);
              this.mservice.setStorage('order_items_'+restId,JSON.stringify(order_items));
               addons = model.addons;
            }
            let menuPriceId=newVal[0];
            this.addons(menuId,menuPriceId,addons);
        }
    this.sub_total = newVal[1];
    this.total = this.sub_total * this.cart.quantity;
    this.total = (100 * this.total / 100);
    this.globals.cart.sub_total=this.sub_total;
    this.globals.onCart();
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
  ngOnInit() {
    this.cart = this.globals.cart;
    this.addonsDisplay = this.globals.addonsDisplay;
    this.items = this.globals.items;
  }

  addMulti() {
    this.cart.quantity = parseInt(this.cart.quantity) + 1;
    this.total = this.sub_total * this.cart.quantity;
    this.total = (100 * this.total / 100);
  }

  addToCart() {
    let self = this;
    let order_items = <any[]>[];
    let radioValidated = true;
    let i = 0;
    let addCollec = this.document.getElementsByClassName('addon-collection[data-selection-type=0]');

    for (let i = 0; i <= addCollec.length; i++) {
      var parent = addCollec[i];
      if (!$(":checked", parent).length) {
        $(".addon-error-message", parent).removeClass("hide");
        if (i === 0) {
          var container = $('.a_area'),
            scrollTo = $(".addon-error-message", parent);
          container.stop().animate({
            scrollTop: scrollTo.offset().top - container.offset().top + container.scrollTop() - 50
          });
          i++;
        }
        radioValidated = false;
      } else {
        $(".addon-error-message", parent).addClass("hide");
      }
    }
    if (!radioValidated) {
      return false;
    }
    let restId = this.globals.globalRestaurantId;

    if (this.mservice.getStorage('order_items_' + restId) !== null) {
      if (this.mservice.getStorage('order_items_' + restId).length > 0) {
        order_items = JSON.parse(this.mservice.getStorage('order_items_' + restId));
      }
    }
  
    let uid = $('#uid').val();
    let model: any = _.find(order_items, function (el: any) {
      return el.uid == uid;
    });
    if (model) {
      model.quantity = $('#quantity').val();
      model.sub_total = $('.sub-total').html();
      model.total_item_price = $('.total').html();
      model.special_instruction = $('.menu_special_instruction_item').val();
      var addons = [];
      if (self.addonSelected) {
        addons = self.addonSelected;
      }
      model.addons = addons;
      self.addonSelected = [];
      this.mservice.setStorage('order_items_' + restId, JSON.stringify(order_items));
    } else {
      var addons = [];
      if (self.addonSelected) {
        addons = self.addonSelected;
      }
      var items = {
        "uid": $('#uid').val(),
        "id": order_items.length,
        "item_id": $('#item_id').val(),
        "item_image_url": $('#item_image_url').val(),
        "item_name": $('#item_name').val(),
        "item_desc": $('#item_desc').val(),
        "prices":this.cart.prices,
        "quantity": $('#quantity').val(),
        "price_id": $('#price_id').val(),
        "price_desc": $('#price_desc').val(),
        "item_price": $('#item_price').val(),
        "sub_total": $('.sub-total').html(),
        "total_item_price": $('.total').html(),
        "special_instruction": $('.menu_special_instruction_item').val(),
        "addons": addons
      };
      order_items.push(items);
      this.mservice.setStorage('order_items_' + restId, JSON.stringify(order_items));
      this.showTooltip(items.item_name);
    }
    self.cartItems = order_items;
    self.globals.cartItems=order_items;
    this.mservice.setStorage('order_type_' + restId, $('input[name=munchservices]:checked').val());
    this.mservice.hidePopUp();
    self.cartItemDisplay = true;
    self.globals.cartItemDisplay = self.cartItemDisplay;
    self.globals.cartCount = 0;
    var cartCount = 0;
    var set_order_items = JSON.parse(self.mservice.getStorage('order_items_' + restId));
    if (set_order_items) {
      $.each(set_order_items, function (index, item) {
        cartCount = (cartCount + parseInt(item.quantity));
      });
    }
    self.globals.cartCount = cartCount;
    self.globals.cartLenth = true;
    if (self.mservice.getStorage('order_type_' + restId) == null || self.mservice.getStorage('order_type_' + restId) == '') {
      self.mservice.setStorage('order_type_' + restId, 'takeout');
    }
    self.globals.order_type = (self.mservice.getStorage('order_type_' + restId)) ? self.mservice.getStorage('order_type_' + restId) : 'takeout';
    self.mservice.renderDateTime(self.globals.order_type);
    self.globals.onCartItem();
    
    //ga('send', 'event', 'Menu Item', "Add to Order" , "Click_on_Add_to_Order_Button", 1, true);
  }

  showTooltip(item) {
    $('.y_tooltip').removeClass('hide');
    $('.added_item').html(item);
    setTimeout(function () {
      $('.y_tooltip').addClass('hide');
      $('.added_item').html('');
    }, 5000);
  };

  subMulti() {
    if (this.cart.quantity > 1) {
      this.cart.quantity = parseInt(this.cart.quantity) - 1;
      this.total = this.sub_total * this.cart.quantity;
      this.total = (100 * this.total / 100);
    }
  }
  selectSubTotal(s) {
    this.sub_total = s.subtotal;
    this.total = this.sub_total * this.cart.quantity;
    this.total = (100 * this.total / 100);
    this.addonSelected = s.addonSelected;
  }


  ngOnDestroy() {
    if (this.onCartChange$Subscription) {
      this.onCartChange$Subscription.unsubscribe();
    }
  }

}
