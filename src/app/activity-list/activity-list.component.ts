import { Component, OnInit } from '@angular/core';
import {MainService} from '../main.service';
@Component({
  selector: 'app-activity-list',
  templateUrl: './activity-list.component.html',
  styleUrls: ['./activity-list.component.css']
})
export class ActivityListComponent implements OnInit {
  activityList:any=""; 
  constructor(private mservice:MainService) { 
    this.mservice.getPointDetails('archive_list').subscribe((data) =>this.getActivity(data));
  }
  
  ngOnInit() {
    this.mservice.getPointDetails('archive_list').subscribe((data) =>this.getActivity(data));
  }
  getActivity(d){
  
    
    this.activityList = d;
  }

}
