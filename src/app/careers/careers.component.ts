import { Component, OnInit,OnDestroy } from '@angular/core';
import {MainService} from '../main.service';
import {Globals} from '../globals';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-careers',
  template: `<div [innerHtml]="myTemplate | safeHtml"></div>`,
  styleUrls: ['./careers.component.css']
})
export class CareersComponent implements OnInit,OnDestroy {
  private myTemplate: any = "";
  onThemeSetEventHeader$Subscription: Subscription;
  constructor(public globals:Globals,private mservice:MainService) {
    this.myTemplate=`<div style="position: fixed;left: calc(50% - 50px);top: calc(50% - 50px);"><img src="assets/img/with_hand.gif"><br/>Please wait...</div>`;
   }

  ngOnInit() {
    this.myTemplate=`<div style="position: fixed;left: calc(50% - 50px);top: calc(50% - 50px);"><img src="assets/img/with_hand.gif"><br/>Please wait...</div>`;
    if(this.globals.globalTheme){
      this.loadCareer();
    }else{
    if(!this.onThemeSetEventHeader$Subscription){
      this.onThemeSetEventHeader$Subscription = this.globals.onThemeSetEvent.subscribe(
        (data) => {
           this.loadCareer();
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
  loadCareer(){
    let _theme=this.globals.globalTheme;
    let self=this;
    self.mservice.getCareerFile(_theme).subscribe((data)=>{
      this.myTemplate=data._body;
    },(err)=>{
      this.myTemplate=`<div style="position: fixed;left: calc(50% - 50px);top: calc(50% - 50px);"><img src="assets/img/with_hand.gif"><br/>Please wait...</div>`;
    })
  }

}
