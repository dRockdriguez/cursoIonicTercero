import { Injectable } from '@angular/core';
import { ScanData } from '../../models/scanData.model';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { ModalController, Platform, ToastController } from 'ionic-angular';
import { MapaPage } from '../../pages/mapa/mapa';
import { Contacts, Contact, ContactField, ContactName } from '@ionic-native/contacts';

@Injectable()
export class HistorialProvider {
  private _historial: ScanData[] = [];

  constructor(private inAppBrowser: InAppBrowser,
    private modalCtrl: ModalController,
    private contacts: Contacts,
    private platform: Platform,
    private toastCtrl: ToastController) {
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
      case 'contacto':
        this.crearContacto(scanData.info);
        break;
      case 'email':
        let htmlLink = scanData.info;
        htmlLink = htmlLink.replace('MATMSG:TO', 'mailto:');
        htmlLink = htmlLink.replace(';SUB:', '?subject=');
        htmlLink = htmlLink.replace(';BODY:', '&body=');
        htmlLink = htmlLink.replace(';;', '');
        htmlLink = htmlLink.replace(/ /g, '%20');
        this.inAppBrowser.create(htmlLink, '_system')
        break;
      default:
        console.error('Tipo no soportado');
    }
  }

  private crearContacto(text: string) {
    if (!this.platform.is('cordova')){
      return;
    }
    let campos: any = this.parse_vcard(text);
    
    let contact: Contact = this.contacts.create();

    contact.name = new ContactName(null, campos.fn);
    contact.phoneNumbers = [new ContactField('mobile', campos.tel[0].value[0])];
    contact.save().then(
      () => this.crearToast('Contacto creado'),
      (error: any) => this.crearToast('Error: ' + error)
    );

  }

  private parse_vcard( input:string ) {

    var Re1 = /^(version|fn|title|org):(.+)$/i;
    var Re2 = /^([^:;]+);([^:]+):(.+)$/;
    var ReKey = /item\d{1,2}\./;
    var fields = {};

    input.split(/\r\n|\r|\n/).forEach(function (line) {
        var results, key;

        if (Re1.test(line)) {
            results = line.match(Re1);
            key = results[1].toLowerCase();
            fields[key] = results[2];
        } else if (Re2.test(line)) {
            results = line.match(Re2);
            key = results[1].replace(ReKey, '').toLowerCase();

            var meta = {};
            results[2].split(';')
                .map(function (p, i) {
                var match = p.match(/([a-z]+)=(.*)/i);
                if (match) {
                    return [match[1], match[2]];
                } else {
                    return ["TYPE" + (i === 0 ? "" : i), p];
                }
            })
                .forEach(function (p) {
                meta[p[0]] = p[1];
            });

            if (!fields[key]) fields[key] = [];

            fields[key].push({
                meta: meta,
                value: results[3].split(';')
            })
        }
    });

    return fields;
  };

  private crearToast(text: string) {
    this.toastCtrl.create({ message: text, duration: 1500}).present();
  }
}
