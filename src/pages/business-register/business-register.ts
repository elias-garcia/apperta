import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Geolocation, Geoposition } from '@ionic-native/geolocation';
import { } from '@types/googlemaps';

@Component({
  selector: 'page-business-register',
  templateUrl: 'business-register.html',
})
export class BusinessRegisterPage {

  @ViewChild('locationInput') locationInput: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private geolocation: Geolocation
  ) { }

  ionViewDidLoad() {
    this.initAutocomplete();
  }

  initAutocomplete() {
    const autocomplete =
      new google.maps.places.Autocomplete(this.locationInput._elementRef.nativeElement.children[0]);

    this.addListenerToAutocomplete(autocomplete);

    this.geolocation.getCurrentPosition().then((position: Geoposition) => {
      const bounds =
        new google.maps.LatLngBounds(
          new google.maps.LatLng(position.coords.latitude, position.coords.longitude));

      autocomplete.setBounds(bounds);
    });
  }

  addListenerToAutocomplete(autocomplete: google.maps.places.Autocomplete) {
    autocomplete.addListener('place_changed', () => {
      console.log(autocomplete.getPlace());
    });
  }

}
