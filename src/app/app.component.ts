import { Component, Inject, Renderer,OnDestroy} from '@angular/core';
import { MainService } from './main.service';
import { DOCUMENT } from '@angular/platform-browser';
import { Globals } from './globals';
import {ActivatedRoute,Router} from "@angular/router";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnDestroy {
  tokenVarify: any = '';
  thememenu: any = '';
  private sub: any;
  private parentRouteId: number;
  constructor(private router: Router,private _routeParams: ActivatedRoute,public globals: Globals, private mservice: MainService, @Inject(DOCUMENT) private document: any, private renderer: Renderer) {
    this.tokenVarify = false;
  }
ngOnDestroy() {
        this.sub.unsubscribe();
    }
  ngOnInit() {
    let authToken = this.mservice.getStorage('oauth.token');
    if (authToken == null) {
      this.postToken();
    } else {
      this.mservice.getToken()
        .subscribe(data => this.flowVerified(data));
    }
    
  }

  postToken() {
    this.mservice.postToken()
      .subscribe(data => this.flowPostVerified(data.token));
  }

  flowVerified(data) {
    if (data.valid) {
       this.tokenVarify = true;
       this.mservice.getTheme()
        .subscribe(data => this.loadTheme(data));
    } else {
      this.postToken();
      this.tokenVarify = false;
    }
  }

  loadTheme(data) {
    
    let _host = document.location.host;
    let _thime = data[_host].theme;
    let _analyticJs = 'assets/template/themes/' + _thime + '/analytic.js';
    
    let node = document.createElement('script');
    node.src = _analyticJs;
    node.type = 'text/javascript';
    document.getElementsByTagName('head')[0].appendChild(node);

    //this.document.getElementById('appAnalytics').setAttribute("src", _analyticJs);
    
    let rootId:number=parseInt(this.mservice.chainRes().rootId);
    if(isNaN(rootId)==true){
      var _restaurant =data[_host].restaurant_id;
    }else{
      var _restaurant =(typeof rootId!=='undefined')?rootId: data[_host].restaurant_id;
    }
    //assign theme & restaurant id to global 
    this.globals.globalRestaurantId = _restaurant;
    this.globals.globalTheme = _thime;
    this.globals.globalThemeSortKey = data[_host].shortKey;
    
    let _themeCss = 'assets/template/themes/' + _thime + '/css/app.css';
    let _themeFavicon = 'assets/template/themes/' + _thime + '/images/favicon.ico';
    
    this.mservice.getThemeDetails(_thime)
      .subscribe((themedata) => this.thememenu = themedata,
      (err) => this.themeNotFound());
     
    this.mservice.getRestaurantDetails(_restaurant)
      .subscribe(
      (resdata) => this.setRestaurantDetails(resdata),
      (err) => this.themeNotFound());
      this.mservice.setLocation()
      .subscribe(
      (resdata) => this.afterSetLocation());
     

    this.document.getElementById('appCSS').setAttribute("href", _themeCss);
    this.document.getElementById('r_favicon').setAttribute("href", _themeFavicon);
    
  }

  afterSetLocation(){
    this.mservice.getUserDetails()
      .subscribe(
      (udata) => this.setUserDetails(udata)); 
  }

  themeNotFound() {
    this.tokenVarify = false;
  }
  setUserDetails(d){
    this.globals.currentUser = d;
    this.globals.onThemeSet();
  }
  setRestaurantDetails(d) {
    this.globals.currentRestaurantDetail = d;
    this.globals.loyalty_code=d.name.charAt(0)+d.id+'00';
    this.globals.onThemeSet();
  }

  flowPostVerified(token) {
    this.mservice.setStorage('oauth.token', token);
    this.tokenVarify = true;
    this.mservice.getTheme()
      .subscribe(data => this.loadTheme(data));
  }


}