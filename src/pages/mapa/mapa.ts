import { Component } from '@angular/core';
import { NavParams, ViewController } from 'ionic-angular';

/**
 * Generated class for the MapaPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-mapa',
  templateUrl: 'mapa.html',
})
export class MapaPage {
  lat: number;
  lng: number;
  constructor(public navParams: NavParams, private viewCtrl: ViewController) {
    let coordsArr = navParams.get('coords').split(',');
    this.lat = Number(coordsArr[0].replace('geo:', ''));
    this.lng = Number(coordsArr[1]);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MapaPage');
  }

  cerrarMapa(){
    this.viewCtrl.dismiss();
  }
}
