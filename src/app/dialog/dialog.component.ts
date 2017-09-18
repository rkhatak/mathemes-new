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
  _data:any;
   myDate =new Date();
  constructor(private global:Globals,private mservice: MainService,private changeDetectorRef: ChangeDetectorRef) {
    this.global.onDialogType.subscribe((d?:any)=>{
      this._id=(typeof d!='undefined')?d.id:0;
      this._data=(typeof d!='undefined')?d:'';
      this.dialogType=this.global.dialogType;
      changeDetectorRef.detach();
      this.changeDetectorRef.detectChanges();
    })
   }
  public dialogType:string='loader';
  
  onDialogType$Subscription: Subscription;
  @Input() sendToPop ;
  ngOnInit() {
    if (!this.onDialogType$Subscription) {
    this.global.onDialogType.subscribe((d?:any)=>{
     this._id=(typeof d!='undefined')?d.id:0;
     this._data=(typeof d!='undefined')?d:'';
      this.dialogType=this.global.dialogType;
      this.changeDetectorRef.detach();
      this.changeDetectorRef.detectChanges();
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
