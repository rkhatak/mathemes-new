import { Component, OnInit,OnDestroy,ChangeDetectorRef } from '@angular/core';
import {MainService} from '../main.service';
import { Globals } from '../globals';
import {Subscription} from 'rxjs/Subscription';
@Component({
  selector: 'app-myaccount',
  templateUrl: './myaccount.component.html',
  styleUrls: ['./myaccount.component.css']
})
export class MyaccountComponent implements OnInit,OnDestroy {
  onThemeSetEvent$Subscription: Subscription;
  constructor(private mservice:MainService,public globals: Globals,private changeDetectorRef:ChangeDetectorRef) { }
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
  this.restID=this.globals.globalRestaurantId;
  this.mservice.getPointDetails('points').subscribe((data) =>this.setData(data));
  this.mservice.getOrderlist('live',this.restID).subscribe((data) =>this.liveList=data);
  this.mservice.getOrderlist('archive',this.restID).subscribe((data) =>this.archiveList=data);
}
  ngOnDestroy(){
    this.onThemeSetEvent$Subscription.unsubscribe();
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
    this.globals.onDialogSet();
  }
}
