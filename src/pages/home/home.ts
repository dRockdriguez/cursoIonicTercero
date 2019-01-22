import { Component } from '@angular/core';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { ToastController, Platform } from 'ionic-angular';
import { HistorialProvider } from '../../providers/historial/historial';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(private barcodeScanner: BarcodeScanner,
    public toastCtrl: ToastController,
    private platform: Platform,
    private historialService: HistorialProvider) {
  }

  scan() {
    if(!this.platform.is('cordova')) {
      this.historialService.addHistorial('http://google.es');
      return;
    }
    this.barcodeScanner.scan().then(barcodeData => {
      if(!barcodeData.cancelled  && barcodeData.text !== null) {
        this.historialService.addHistorial(barcodeData.text);
      }
    }).catch(err => {
      this.mostrarMensaje('Error ' + err);
    });
  }

  mostrarMensaje(mensaje: string){
    const toast = this.toastCtrl.create({
      message: mensaje,
      duration: 15000
    });
    toast.present();
  }
}
