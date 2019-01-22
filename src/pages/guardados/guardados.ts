import { Component } from '@angular/core';
import { IonicPage } from 'ionic-angular';
import { HistorialProvider } from '../../providers/historial/historial';
import { ScanData } from '../../models/scanData.model';

/**
 * Generated class for the GuardadosPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-guardados',
  templateUrl: 'guardados.html',
})
export class GuardadosPage {
  historial: ScanData[] = [];

  constructor(private historialService: HistorialProvider) {
  }

  ionViewDidLoad() {
    this.historial = this.historialService.getHistorial();
  }

  abrirScan(i: number){
    this.historialService.abrirScan(i);
  }

}
