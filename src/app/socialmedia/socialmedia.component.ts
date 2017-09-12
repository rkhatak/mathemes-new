import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-socialmedia',
  templateUrl: './socialmedia.component.html',
  styleUrls: ['./socialmedia.component.css']
})
export class SocialmediaComponent implements OnInit {

  constructor() { }

  ngOnInit() {
   var url = window.location.href;
        if(url.indexOf('userinactive')>-1){
            window.opener.closeCallbackError();
        }
        else if (url.indexOf('twitter') > -1) {
            window.opener.closeCallbackFunctionForTwitter();
        } else {
            window.opener.closeCallbackFunction();
        }
        window.close();
  }

}
