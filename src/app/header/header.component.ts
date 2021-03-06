import {Component,Inject,OnInit,OnDestroy, ChangeDetectorRef} from '@angular/core';
import {MainService} from '../main.service';
import {Globals} from '../globals';
import { DOCUMENT } from '@angular/platform-browser';
import { Subscription } from 'rxjs/Subscription';
import { Router } from '@angular/router';
declare var $: any;
function windowRef(): any {
  return window;
}

@Component({
    selector: 'header-app',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit,OnDestroy {
headermenu:any='';
public is_login:boolean=false;
public headerLogo:string=''; 
onThemeSetEventHeader$Subscription: Subscription;
private restaurantAddress: object;
public multipleAddress:boolean=false;
public _currentRestaurant:any;
private lat:any;
private long:any;
public rootId:any;
public rootPage:any;   
cartCount:any;
constructor(private router:Router,public globals:Globals,private mservice:MainService,@Inject(DOCUMENT) private document: any, private changeDetectorRef: ChangeDetectorRef) {
this.globals.onCartItemChange.subscribe(
        (data) => {
          let restId=this.globals.globalRestaurantId;
          var cartCount = 0;
          let cartItems=(this.mservice.getStorage('order_items_' + restId))?JSON.parse(this.mservice.getStorage('order_items_' + restId)):[];
          if (cartItems.length>0) {
            $.each(cartItems, function (index, item) {
              cartCount = (cartCount + parseInt(item.quantity));
            });
          }
          this.cartCount=(this.globals.cartCount>0)?this.globals.cartCount:cartCount;
        }
      );
}

 ngOnInit() {
     if(this.globals.globalTheme){
      this.loadTheme();
      this.getContact();
    }else{
    if(!this.onThemeSetEventHeader$Subscription){
      this.onThemeSetEventHeader$Subscription = this.globals.onThemeSetEvent.subscribe(
        (data) => {
           this.loadTheme();
           this.getContact();
        }
      );
    }
    }
}
  ngOnDestroy() {
    if(this.onThemeSetEventHeader$Subscription){
      this.onThemeSetEventHeader$Subscription.unsubscribe();
    }
  }

 private getContact(): void {
    let _theme = this.globals.globalTheme;
    this._currentRestaurant=this.globals.currentRestaurantDetail;
    this.mservice.getChainRestaurant(_theme)
      .subscribe(
      (data) =>this.setContacts(data),
      (err)=>this.getResError());
  }

  private getResError() :void{
     this.multipleAddress=false;
  }
  private setContacts(d):void{
    let rootId=parseInt(this.mservice.chainRes().rootId);
    let rootPage=this.mservice.chainRes().rootPage;
    this.rootPage=(rootPage)?rootPage:'home';
    if(isNaN(rootId)==true){
     this.multipleAddress=true;
     this.restaurantAddress=d;
    }else{
      this.rootId=`/${rootId}`;
    }
  }
goLocation(id,page){
let url=`/${id}/${page}`;  
this.router.navigate([url]);
location.reload();
}
goHome(){
this.router.navigate(['/home']);
location.reload();
}

selectLocation(){
  this.document.querySelector('.multipleAdd').classList.toggle('hide');
}

  loadTheme(){
   let _thime=this.globals.globalTheme;
   let restId=this.globals.globalRestaurantId;
          var cartCount = 0;
          let cartItems=(this.mservice.getStorage('order_items_' + restId))?JSON.parse(this.mservice.getStorage('order_items_' + restId)):[];
          if (cartItems.length>0) {
            $.each(cartItems, function (index, item) {
              cartCount = (cartCount + parseInt(item.quantity));
            });
          }
          this.cartCount=(this.globals.cartCount>0)?this.globals.cartCount:cartCount;
  
   let varCheckLogin:any =this.mservice.getStorage('is_login');
   this.is_login=(varCheckLogin=='true')?true:this.globals.is_login;
   this.headerLogo=this.globals.baseThemeImage+_thime+'/images/';
   this.changeDetectorRef.detectChanges();
   this.globals.is_login=this.is_login;
   this.globals.onCart();
   this.mservice.getThemeDetails(_thime)
      .subscribe(themedata =>this.headermenu=themedata);        
       
  }
  
  goResponsive(){
      this.document.querySelector('.link_mobilemenu').classList.toggle('active');
      this.document.querySelector('.dropdown_mobile').classList.toggle('active');
  }
  userRegister(){
    this.globals.dialogType="register";
    this.globals.onDialogSet();
  }
  userlogin(){
    this.globals.dialogType="login";
    this.globals.onDialogSet();
  }
  logout(){
    let self=this;
    this.globals.onThemeSet();
    this.mservice.userLogout().subscribe();
    this.mservice.setLocation().subscribe(()=>{
      this.mservice.getUserDetails()
      .subscribe(
      (udata) => self.setUserDetails(udata));
    });
  }
   setUserDetails(d) {
    let self=this; 
    this.mservice.setStorage('is_login',false);
    this.globals.is_login=false; 
    this.globals.currentUser = d;
    this.globals.onThemeSet();   
    self.router.navigate(['/home']); 
    //this.onThemeSetEvent$Subscription.unsubscribe();
  }
  reservetable(){
    $('.popup_reservetable_overlay').show();
    $('.formstep1').show();
    //this.globals.dialogType="reservation";
    //this.globals.onDialogSet({"isReservationTime":true,"isShowReservation":false});
    let res_name=this.globals.currentRestaurantDetail.name;
    let selfWindow = windowRef();
    selfWindow.ga('send', 'event', `Top Menu Bar ${res_name}`, "Reserve a table Click" , "Click_Reserve_a_table_in_Top_Menu", 1, true);
  }
  orderOnline(){
    let res_name=this.globals.currentRestaurantDetail.name;
    let selfWindow = windowRef();
    selfWindow.ga('send', 'event', `Top Menu Bar ${res_name}`, "Order Online Click" , "Click_Order_Online_in_Top_Menu", 1, true);
   }
}