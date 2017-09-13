import { Component, OnInit,ChangeDetectorRef } from '@angular/core';
import {MainService} from '../main.service';
@Component({
  selector: 'app-activity-list',
  templateUrl: './activity-list.component.html',
  styleUrls: ['./activity-list.component.css']
})
export class ActivityListComponent implements OnInit {
  activityList:any=""; 
  constructor(private mservice:MainService,private changeDetectorRef:ChangeDetectorRef) {}
  
  ngOnInit() {
    this.mservice.getPointDetails('archive_list').subscribe((data) =>this.getActivity(data));
  }
  getActivity(d){
    console.log(d);
    this.activityList = d;
    this.changeDetectorRef.detectChanges();
  }

}
