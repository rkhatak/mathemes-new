import {Injectable} from '@angular/core';
import {Subject} from 'rxjs/Subject';

@Injectable()
export class Globals {
    apiBaseUrl :string='http://api.munchado.in/wapi/'; 
    globalRestaurantId :number=0;
    globalTheme :string='';
    globalThemeSortKey :string='';
    baseThemeImage :string='assets/template/themes/';
    currentRestaurantDetail :any='';
    currentUser:any; 
    dialogType :string='loader';
    cart :any; 
    addons :any; 
    addonsDisplay:boolean;
    items :any;
    cartItemDisplay:boolean;
    cartCount:number=0;
    cartLenth:boolean;
    order_type:any;
    date:any;
    time:any;
    is_login:boolean=false;
    selectedDate:any;
    selectedTime:any;
    dates:any;
    timeEdit:boolean;
    cartItems:any;
    deliveryOrderCart:boolean;
    cartTime:any;
    cartTimeEdit:any;
    setDeliveryAddress:any;
    tooltipselecttime:boolean=false;
    loyalty_code:any="";
    onThemeSetEvent = new Subject<object>()
    onDialogType = new Subject<object>()
    onCartChange = new Subject<any>()
    onCartItemChange = new Subject<any>()
    onLoginChange = new Subject<any>()
    redeemable_point:any;
    promocode:any;
    promocodeSet = new Subject<any>()
    
    public onThemeSet(){
        this.onThemeSetEvent.next();
    }
    public onDialogSet(data?:object){
        this.onDialogType.next(data);
    }
    public onCart(){
        this.onCartChange.next();
    }
    public onCartItem(){
        this.onCartItemChange.next();
    }
    public setLogin(){
        this.onLoginChange.next();
    }
    public setPromocode(){
        this.promocodeSet.next();
    }
}
