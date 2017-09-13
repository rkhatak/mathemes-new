import { Component, OnInit,ChangeDetectorRef } from '@angular/core';
import { Globals } from '../globals';
import {MainService} from '../main.service';
@Component({
  selector: 'app-activity-list',
  templateUrl: './activity-list.component.html',
  styleUrls: ['./activity-list.component.css']
})
export class ActivityListComponent implements OnInit {
  activityList:any=""; 
  redeemable_point:any="";
  constructor(private mservice:MainService,private changeDetectorRef:ChangeDetectorRef,public globals: Globals) {}
  
  ngOnInit() {
    this.mservice.getPointDetails('archive_list').subscribe((data) =>this.getActivity(data));
  }
  getActivity(d){
    this.activityList = d;
    this.redeemable_point = this.globals.redeemable_point
    this.changeDetectorRef.detectChanges();
  }

}
