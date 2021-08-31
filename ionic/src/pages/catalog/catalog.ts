import { Component, ViewChild, NgZone } from '@angular/core';
import { NavController, Slides, Platform } from 'ionic-angular';
import { CatalogdetailsPage } from '../Catalogdetails/Catalogdetails';
import { BlueApiServiceProvider } from '../../providers/blue-api-service/blue-api-service';
import { UtilsProvider } from '../../providers/utils/utils'

@Component({
  selector: 'page-catalog',
  templateUrl: 'catalog.html'
})
export class CatalogPage {
  cards;

  constructor(public navCtrl: NavController, private restService: BlueApiServiceProvider, public zone: NgZone, private utils: UtilsProvider) { 
    
  }

  ionViewWillEnter() {
    this.utils.presentLoading()
    this.restService.getCatalog((data) => {
      this.zone.run(() => {
        this.cards = data.responseJSON;
        this.utils.dismissLoading()
      })
    }, (error) => {
      this.utils.dismissLoading()
      alert("Failure : " + JSON.stringify(error))
    })
  }

  cardTapped(card) {
    this.navCtrl.push(
      CatalogdetailsPage,
      { cardDetails: card }
    );
  }

  share(card) {
    alert(card.title + ' was shared.');
  }

  listen(card) {
    alert('Listening to ' + card.title);
  }

  favorite(card) {
    alert(card.title + ' was favorited.');
  }
}
