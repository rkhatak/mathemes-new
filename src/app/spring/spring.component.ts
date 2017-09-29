import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';
declare var $: any;

@Component({
  selector: 'app-spring',
  templateUrl: './spring.component.html',
  styleUrls: ['./spring.component.css']
})
export class SpringComponent implements OnInit {

  constructor(public sanitizer: DomSanitizer) { }
  public sprImage=['thai_mule.jpg','spicy_tamarind.jpg','spiced_tomyum.jpg','mandarin_roy.jpg','emerald_kiwi.jpg',
'yuzu_luxe.jpg','botanical_tart.jpg','leche_mojito.jpg','thai_breeze.jpg'];
  ngOnInit() {
  }

  menuImageSafe(url, image) {
    let imageFullPath = url + image;
    return this.sanitizer.bypassSecurityTrustStyle(`url('${imageFullPath}')`);
  }

  navigateSlider(img,e){
    window.location.hash="#"+img;
    $('.url').removeClass('active');
    $(e.currentTarget).addClass('active');
  }

}
