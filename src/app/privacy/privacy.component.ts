import { Component, OnInit,OnDestroy } from '@angular/core';
import {Subscription} from 'rxjs/Subscription';
import {Globals} from '../globals';
function windowRef(): any {
  return window;
}
@Component({
  selector: 'app-privacy',
  templateUrl: './privacy.component.html',
  styleUrls: ['./privacy.component.css']
})
export class PrivacyComponent implements OnInit,OnDestroy {

  constructor(public globals:Globals) { }
  onThemeSetEvent$Subscription: Subscription;
  currentRes:any;
  resname:any;
  ngOnInit() {
     if(this.globals.globalTheme){
      this.getPrivacy();
    }else{
    if(!this.onThemeSetEvent$Subscription){
      this.onThemeSetEvent$Subscription = this.globals.onThemeSetEvent.subscribe(
        () => {
           this.getPrivacy();
        }
      );
    }
    }
  }

  getPrivacy(){
    this.currentRes=this.globals.currentRestaurantDetail;  
    this.resname=this.currentRes.name;    
    let selfWindow = windowRef();
    selfWindow.ga('send', 'event', `Top Menu Bar ${this.resname}`, 'Privacy Click' , 'Click_on_privacy_in_Top_Menu', 1, true);
  }
  ngOnDestroy() {
    if(this.onThemeSetEvent$Subscription){
      this.onThemeSetEvent$Subscription.unsubscribe();
    }
  }

}
