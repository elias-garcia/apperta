import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

@Component({
  selector: 'page-maps',
  templateUrl: 'maps.html',
})
export class MapsPage {

  @ViewChild('mapContainer') public mapContainerRef: ElementRef;

  public map: google.maps.Map;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams
  ) { }


  ionViewDidLoad() {
    this.loadMap();
  }

  loadMap() {
    const latLng = new google.maps.LatLng(-34.9290, 138.6010);
    const mapOptions = {
      center: latLng,
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    }

    this.map = new google.maps.Map(this.mapContainerRef.nativeElement, mapOptions);

    new google.maps.Marker({
      position: latLng,
      map: this.map,
      title: 'Hello World!'
    });
  }

}
