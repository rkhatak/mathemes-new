import { Component, OnInit,OnDestroy } from '@angular/core';
import {Subscription} from 'rxjs/Subscription';
import {Globals} from '../globals';
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
  }
  ngOnDestroy() {
    if(this.onThemeSetEvent$Subscription){
      this.onThemeSetEvent$Subscription.unsubscribe();
    }
  }

}
