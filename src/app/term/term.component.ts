import { Component, OnInit,OnDestroy } from '@angular/core';
import {Subscription} from 'rxjs/Subscription';
import {Globals} from '../globals';
function windowRef(): any {
  return window;
}
@Component({
  selector: 'app-term',
  templateUrl: './term.component.html',
  styleUrls: ['./term.component.css']
})
export class TermComponent implements OnInit,OnDestroy {

  constructor(public globals:Globals) { }
  onThemeSetEvent$Subscription: Subscription;
  currentRes:any;

 ngOnInit() {
     if(this.globals.globalTheme){
      this.getTerms();
    }else{
    if(!this.onThemeSetEvent$Subscription){
      this.onThemeSetEvent$Subscription = this.globals.onThemeSetEvent.subscribe(
        () => {
           this.getTerms();
        }
      );
    }
    }
  }
  getTerms(){
    this.currentRes=this.globals.currentRestaurantDetail;  
    let res_name=this.globals.currentRestaurantDetail.name;
    let selfWindow = windowRef();
    selfWindow.ga('send', 'event', `Top Menu Bar ${res_name}`, 'Term Click' , 'Click_on_term_in_Top_Menu', 1, true);
  }
 ngOnDestroy() {
    if(this.onThemeSetEvent$Subscription){
      this.onThemeSetEvent$Subscription.unsubscribe();
    }
 }
}
