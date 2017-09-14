import { Component, OnInit,ChangeDetectorRef,Input} from '@angular/core';
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
  @Input() _id;
  ngOnInit() {
    let ids=this._id;
    console.log(ids);
    this.mservice.getOrderDetails(ids).subscribe((data) =>this.getDetail(data));
  }
  getDetail(d){
    this.details = d;
    this.changeDetectorRef.detectChanges();
  }

}
