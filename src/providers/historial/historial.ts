import { Injectable } from '@angular/core';
import { ScanData } from '../../models/scanData.model';
import { InAppBrowser } from '@ionic-native/in-app-browser';

@Injectable()
export class HistorialProvider {
  private _historial: ScanData[] = [];

  constructor(private inAppBrowser: InAppBrowser) {
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
      default:
        console.error('Tipo no soportado');
    }
  }

}
