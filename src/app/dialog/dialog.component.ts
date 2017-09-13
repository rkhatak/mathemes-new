import { Component, OnInit,OnDestroy,ChangeDetectorRef,Input} from '@angular/core';
import { Globals } from '../globals';
import { Subscription } from 'rxjs/Subscription';
import { MainService } from '../main.service';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css']
})
export class DialogComponent implements OnInit, OnDestroy {
  _id:number;
  constructor(private global:Globals,private mservice: MainService,private changeDetectorRef: ChangeDetectorRef) {
    this.global.onDialogType.subscribe((d?:any)=>{
      this._id=d.id;
      changeDetectorRef.detach();
      this.dialogType=this.global.dialogType;
    })
   }
  public dialogType:string='loader';
  
  onDialogType$Subscription: Subscription;
  @Input() sendToPop ;
  ngOnInit() {
    if (!this.onDialogType$Subscription) {
    this.global.onDialogType.subscribe((d?:any)=>{
      this._id=d.id;
      this.changeDetectorRef.detach();
      this.changeDetectorRef.detectChanges();
      this.dialogType=this.global.dialogType;
      this.mservice.showPopUp();
    })
  }  
  }
  closeDialog(){
    this.mservice.hidePopUp();
  }
  ngOnDestroy() {
    if (this.onDialogType$Subscription) {
      this.onDialogType$Subscription.unsubscribe();
    }
  }

}
