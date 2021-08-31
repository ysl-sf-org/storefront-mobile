import { Component, NgZone } from '@angular/core';

import { CatalogPage } from '../catalog/catalog';
import { LoginPage } from '../login/login';
import { HomePage } from '../home/home';
import { ProfilePage } from '../profile/profile';
import { App, Tabs, NavController } from 'ionic-angular';
import { BlueApiServiceProvider } from '../../providers/blue-api-service/blue-api-service';

@Component({
  templateUrl: 'tabs.html'
})


export class TabsPage {

  tab1Root = HomePage;
  tab2Root = CatalogPage;
  tab3Root = LoginPage;
  tab4Root = ProfilePage;
  previoustab = 'Root';

  constructor(private zone: NgZone, private navCtrl: NavController, public restService : BlueApiServiceProvider, private app: App) {
  }

  logout() {
    this.setActiveTab('Logout');
    this.zone.run(() => {
      this.restService.userState.accessToken = null;
      this.restService.userState.authenticated = false;
      const tabsNav = this.app.getNavByIdOrName('mainTab') as Tabs;
      tabsNav.select(0);
    });  
  }

  setActiveTab(currentTab: string): void {
    WL.Analytics.log(
      {
        fromPage: this.previoustab,
        toPage: currentTab
      },
      'PageTransition'
    );
    this.previoustab = currentTab;
  }
  
 }
