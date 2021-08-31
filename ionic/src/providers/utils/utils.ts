import { Injectable } from '@angular/core';
import { LoadingController } from 'ionic-angular';

/*
  Generated class for the UtilsProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class UtilsProvider {

  private loading =  this.loadingController.create({
    content: 'Please wait...',
    duration: 5000
  });

  constructor(private loadingController: LoadingController) {
  }

  async presentLoading() {
    this.loading = this.loadingController.create({
      content: 'Please wait...',
      duration: 5000
    });
    this.loading.present();
  }

  async dismissLoading() {
    this.loading.dismiss();
  }

}
