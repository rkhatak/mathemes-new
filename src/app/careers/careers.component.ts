import { Component, OnInit, OnDestroy, ElementRef, ChangeDetectorRef } from '@angular/core';
import { MainService } from '../main.service';
import { Globals } from '../globals';
import { Subscription } from 'rxjs/Subscription';
declare var $: any;

@Component({
  selector: 'app-careers',
  template: `<div [innerHtml]="myTemplate | safeHtml"></div>`,
  styleUrls: ['./careers.component.css']
})
export class CareersComponent implements OnInit, OnDestroy {
  public myTemplate: any = "";
  fired: number = 0;
  onThemeSetEventHeader$Subscription: Subscription;
  constructor(private elRef: ElementRef, private cdRef: ChangeDetectorRef, public globals: Globals, private mservice: MainService) {
    this.myTemplate = `<div style="position: fixed;left: calc(50% - 50px);top: calc(50% - 50px);"><img src="assets/img/with_hand.gif"><br/>Please wait...</div>`;
  }

  ngOnInit() {
    this.myTemplate = `<div style="position: fixed;left: calc(50% - 50px);top: calc(50% - 50px);"><img src="assets/img/with_hand.gif"><br/>Please wait...</div>`;
    if (this.globals.globalTheme) {
      this.loadCareer();
    } else {
      if (!this.onThemeSetEventHeader$Subscription) {
        this.onThemeSetEventHeader$Subscription = this.globals.onThemeSetEvent.subscribe(
          (data) => {
            this.loadCareer();
          }
        );
      }
    }
  }
  ngOnDestroy() {
    if (this.onThemeSetEventHeader$Subscription) {
      this.onThemeSetEventHeader$Subscription.unsubscribe();
    }
  }
  loadCareer() {
    let _theme = this.globals.globalTheme;
    let self = this;
    self.mservice.getCareerFile(_theme).subscribe((data) => {
      self.myTemplate = data._body;
      self.cdRef.detectChanges();
      self.elRef.nativeElement.querySelector('.r_career_Submit').addEventListener('click', this.careersubmit.bind(this));
    }, (err) => {
      self.myTemplate = `<div style="position: fixed;left: calc(50% - 50px);top: calc(50% - 50px);"><img src="assets/img/with_hand.gif"><br/>Please wait...</div>`;
    })
  }
 
  careersubmit(e) {
    let self = this;
    self.fired += 1;
    let validateInput:boolean=true;
    let validateTextArea:boolean=true;
    if (self.fired == 1) {
      $('input,textarea').each(
        function (i,v) {
          if($(this).is("input")){
            let _class=$(this).attr('class');
            if(_class=='required' || _class=='emailrequired'){
            let _id=$(this).attr('id');
            let outPut=_id+'_error';
            validateInput=self.mservice.validateField(_id,outPut);
              if(validateInput){
               self.fired=0;   
              }
              if(_class=='emailrequired'){
               validateInput=self.mservice.validateEmailNow(_id,outPut);
                if(validateInput){
                self.fired=0;   
                } 
              }
            }
          }
          if($(this).is("textarea")){
            let _class=$(this).attr('class');
            let _id=$(this).attr('id');
            let outPut=_id+'_error';
            validateTextArea=self.mservice.validateField(_id,outPut);
              if(validateTextArea){
               self.fired=0;   
              }
          }
          if(validateInput==false && validateTextArea==false){
            let formData=$('.r_career_form').serializeArray();
            self.mservice.sendCareer(formData).subscribe((res)=>{
             $('.form_application').hide();
             $('.application-success').removeClass('hide');
            },(err)=>{
              $('.form_application').show();
             $('.application-success').addClass('hide');
            })
            
          }
           
        }
      );

    }

  }

}
