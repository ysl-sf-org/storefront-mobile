import { Component, Renderer, NgZone } from '@angular/core';
import {
  NavController,
  NavParams,
  Platform
} from 'ionic-angular';
import { BlueApiServiceProvider } from '../../providers/blue-api-service/blue-api-service';
import { UtilsProvider } from '../../providers/utils/utils'

@Component({
  selector: 'page-Catalogdetails',
  templateUrl: 'Catalogdetails.html'
})
export class CatalogdetailsPage {
  itemQuantity = 0;
  quantity:string
  card = {};
  constructor(
    public navCtrl: NavController,
    public renderer: Renderer,
    public navParams: NavParams,
    public platform: Platform,
    private restService: BlueApiServiceProvider,
    private zone:NgZone,
    private utils: UtilsProvider
  ) {
    this.card = navParams.data.cardDetails;
  }
  viewPlatform: string = '';
  ionViewWillLeave() {
    this.navCtrl.pop();
  }


  buyItem() {
    if(this.itemQuantity > 0) {
      this.utils.presentLoading()
      var payload = {
        itemId: this.card["id"],
        count: this.itemQuantity,
        notifyMobile: 'true'
      }
      this.restService.buyItems(payload, (response) => {
          this.zone.run(() => {
            this.utils.dismissLoading()
            alert("Ordered request sent")
            this.quantity = null;
          })
      }, (error) => {
        console.log("Buy Item Error: " + JSON.stringify(error));
        this.zone.run(() => {
          this.utils.dismissLoading()
          alert("Failed to place an order. Error : " + JSON.stringify(error))
          this.quantity = null;
        })
    });
    } else {
      alert("Please select one or more quantity in order to place an order")
    }
  }

  handleButtonClick() {
    console.log('clicked');
  }

  setQuantity(count) {
    this.itemQuantity = count;
  }
}
