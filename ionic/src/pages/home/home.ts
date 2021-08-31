import { Component, Renderer } from '@angular/core';
import { NavController, App, Tabs } from 'ionic-angular';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public renderer: Renderer, public navCtrl: NavController, private app: App) {
    renderer.listenGlobal('document', 'mfpjsloaded', () => {
      WL.Analytics.enable();
    });
  }

  navigateToCatalog() {
    const tabsNav = this.app.getNavByIdOrName('mainTab') as Tabs;
    tabsNav.select(1);
  }
}