import { Component, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { BlueApiServiceProvider } from '../../providers/blue-api-service/blue-api-service'
import { UtilsProvider } from '../../providers/utils/utils'

/**
 * Generated class for the ProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {

  ordersData = [];
  customerInfo = {
    username: "guest",
    firstName: "Guest",
    lastName: "Guest",
    email: "guest@email.com"
  };

  constructor(public zone: NgZone, public navCtrl: NavController, public navParams: NavParams, private restService: BlueApiServiceProvider, private utils: UtilsProvider) {
  }

  ionViewWillEnter() {
    this.utils.presentLoading()
    this.restService.getCustomerProfile((data) => {
      this.utils.dismissLoading()
      console.log("getCustomerProfile Success" + JSON.stringify(data))
      this.zone.run(() => {
        this.customerInfo = data.responseJSON[0]
      })
    }, (error) => {
      this.utils.dismissLoading()
      console.log("getCustomerProfile Error" + JSON.stringify(error))
    })
    this.restService.getCatalog((data) => {
      var catalogMap = {};
      var catalog = data.responseJSON;
      for (let i = 0; i < catalog.length; i++) {
        var cat = catalog[i];
        catalogMap[cat.id] = cat.name;
      }
      this.restService.getCustomerOrders((response) => {
        this.zone.run(() => {
          console.log("Get Orders Result" + response.responseJSON)
          var ordersInfo = response.responseJSON;
          this.ordersData = [];
          for (let i = 0; i < ordersInfo.length; i++) {
            let o = ordersInfo[i];
            this.ordersData.push({ date: o.date, itemId: o.itemId, itemName: catalogMap[o.itemId], count: o.count });
          }
        })
      }, (error) => {
        console.log("error" + JSON.stringify(error))
      })
    }, (error) => {
      alert("Failure : " + JSON.stringify(error))
    })
  }
}
