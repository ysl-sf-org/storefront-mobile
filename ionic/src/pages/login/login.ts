import { Component, NgZone } from '@angular/core';
import { NavController, App, Tabs } from 'ionic-angular';
import { BlueApiServiceProvider } from '../../providers/blue-api-service/blue-api-service';
import { UtilsProvider } from '../../providers/utils/utils'

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {
  username: string;
  password: string;
  loginError = false;
  private BlueAuthChallengeHandler: WL.Client.SecurityCheckChallengeHandler;

  constructor(public zone: NgZone, public navCtrl: NavController, public restService: BlueApiServiceProvider, private app: App, private utils: UtilsProvider) {
    this.registerChallengeHandler()
  }

  login() {
    this.utils.presentLoading()
    WLAuthorizationManager.login('BlueAuthLogin', {
      username: this.username,
      password: this.password,
      scope: 'blue'
    }).then((response) => {
      console.log("Login Result" + JSON.stringify(response))
      this.restService.userState.authenticated = true;
      this.initializePush()
    }, error => {
      this.zone.run(() => {
        this.utils.dismissLoading()
        console.log("Login Error: " + JSON.stringify(error));
        this.password = "";
        this.loginError = true;
      });
    })
  }

  registerChallengeHandler() {
    this.BlueAuthChallengeHandler = WL.Client.createSecurityCheckChallengeHandler("BlueAuthLogin");
    this.BlueAuthChallengeHandler.handleChallenge = ((response: any) => {
      console.log('BlueAuthChallengeHandler.handleChallenge called. Error : ' + response.errorMsg);
      this.BlueAuthChallengeHandler.cancel()
    });

    this.BlueAuthChallengeHandler.handleFailure = (error: any) => {
      console.log('Login Failed : ' + JSON.stringify(error));
    };
    this.BlueAuthChallengeHandler.handleSuccess = (response: any) => {
      console.log('Login Success : ' + JSON.stringify(response));
      this.restService.userState.accessToken = response.user.attributes.access_token;
    };
  }

  navigateToCatalog() {
    this.zone.run(() => {
      this.password = "";
      this.loginError = false;
      this.utils.dismissLoading()
      const tabsNav = this.app.getNavByIdOrName('mainTab') as Tabs;
      tabsNav.select(0);
    });
  }

  initializePush() {
    this.navigateToCatalog()
    MFPPush.initialize(
      () => {
        MFPPush.registerNotificationsCallback(this.notificationReceived);
        MFPPush.registerDevice(null, this.successCallback, this.failureCallback)
      },
      () => {
        console.log("Failed to initialize");
      }
    );
  }

  notificationReceived = (message) => {
    if (message.alert.body !== undefined) {
      alert(message.alert.body);
    } else {
      alert(message.alert);
    }
  };

  successCallback = (response) => {
    console.log("Push Registration Success: " + JSON.stringify(response));
  };

  failureCallback = (response) => {
    console.log("Push Registration Error: " + JSON.stringify(response));
  };
}


