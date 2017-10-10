import { Component,Input, OnInit, OnDestroy,Inject } from '@angular/core';
import {MainService} from '../main.service';
import {Globals} from '../globals';
import {Subscription} from 'rxjs/Subscription';
import { PageScrollConfig, PageScrollService, PageScrollInstance } from 'ng2-page-scroll';
import { DOCUMENT } from '@angular/platform-browser';
function windowRef(): any {
  return window;
}
@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit, OnDestroy {
  public overview:any='';
  myDate=new Date();
  showStory:boolean=false;
  onThemeSetEvent$Subscription: Subscription;
  constructor(private mservice:MainService,public globals:Globals,@Inject(DOCUMENT) private document: any,private pageScrollService: PageScrollService) {

   }
  
  ngOnInit() {
    if(this.globals.globalRestaurantId){
      this.getRestaurantOverview();
    } else {
      if(!this.onThemeSetEvent$Subscription) {
        this.onThemeSetEvent$Subscription = this.globals.onThemeSetEvent.subscribe(
          () => {
            this.getRestaurantOverview();
          }
        );
      }
    }
  }

  ngOnDestroy() {
    if(this.onThemeSetEvent$Subscription){
      this.onThemeSetEvent$Subscription.unsubscribe();
    }
  }

  getIcon(features_key) {                   
                   return "greenP_"+features_key.replace(/[- \/&]/g,'_')+"_Icon" ;               
  };

  readStory(e){
    let self=this;
    e.preventDefault();
    e.currentTarget.style.display="none";
    this.showStory =true;
    setTimeout(function(){
        let pageScrollInstance: PageScrollInstance = PageScrollInstance.simpleInstance(self.document, '#story');
        self.pageScrollService.start(pageScrollInstance);
    },500);
    let selfWindow = windowRef();
    selfWindow.ga('send', 'event', 'About', "Read our story" , "Click_on_Read_our_Story_Button", 1, true);
  }

  private getRestaurantOverview(){
    let _currentRestId=this.globals.globalRestaurantId;
  
    this.mservice.getRestaurantOverview(_currentRestId)
      .subscribe(overviewdata =>this.overview=overviewdata);
      let res_name=this.globals.currentRestaurantDetail.name;
      let selfWindow = windowRef();
      selfWindow.ga('send', 'event', `Top Menu Bar ${res_name}`, 'About Click' , 'Click_on_about_in_Top_Menu', 1, true);
  }

}
