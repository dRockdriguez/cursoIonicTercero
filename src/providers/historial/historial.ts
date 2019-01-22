import { Injectable } from '@angular/core';
import { ScanData } from '../../models/scanData.model';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { ModalController } from 'ionic-angular';
import { MapaPage } from '../../pages/mapa/mapa';

@Injectable()
export class HistorialProvider {
  private _historial: ScanData[] = [];

  constructor(private inAppBrowser: InAppBrowser, private modalCtrl: ModalController) {
  }

  addHistorial(texto: string) {
    let data = new ScanData(texto);

    this._historial.unshift(data);
    this.abrirScan(0)
  }

  getHistorial() {
    return this._historial;
  }

  abrirScan(i: number) {
    let scanData = this._historial[i];
    switch(scanData.tipo) {
      case 'http':
        const browser = this.inAppBrowser.create(scanData.info, '_system');
        break;
      case 'mapa':
        this.modalCtrl.create(MapaPage, { coords: scanData.info } ).present();
        break;
      default:
        console.error('Tipo no soportado');
    }
  }

}
