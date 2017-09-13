import { Component, OnInit,ChangeDetectorRef } from '@angular/core';
import { Globals } from '../globals';
import {MainService} from '../main.service';
import {Subscription} from 'rxjs/Subscription';
@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.css']
})
export class OrderDetailsComponent implements OnInit {
  onThemeSetEvent$Subscription: Subscription;
  constructor(private mservice:MainService,public globals: Globals,private changeDetectorRef:ChangeDetectorRef) { }
  details:any="";
  ngOnInit() {
    let ids=328;
    this.mservice.getOrderDetails(ids).subscribe((data) =>this.getDetail(data));
  }
  getDetail(d){
    this.details = d;
    this.changeDetectorRef.detectChanges();
  }

}
