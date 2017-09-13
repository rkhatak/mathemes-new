import { Component, OnInit } from '@angular/core';
import {MainService} from '../main.service';
@Component({
  selector: 'app-activity-list',
  templateUrl: './activity-list.component.html',
  styleUrls: ['./activity-list.component.css']
})
export class ActivityListComponent implements OnInit {

  constructor(private mservice:MainService) { }

  ngOnInit() {
  }

}
