import { Component } from '@angular/core';
import { LoadingController, Platform } from '@ionic/angular';
import { Deploy } from 'cordova-plugin-ionic/dist/ngx';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private loadingCtrl: LoadingController,
    private deploy: Deploy
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      if (this.platform.is('cordova')) {
        this.statusBar.styleDefault();
        this.splashScreen.hide();
        this.performManualUpdate();
      }
    });
  }

  async performManualUpdate() {
    const update = await this.deploy.checkForUpdate();
    if (update.available) {
      const loading = await this.loadingCtrl.create({
        message: 'The app is getting updated...',
      });
      await loading.present();
      await this.deploy.downloadUpdate((progress) => {
        loading.message = `Downloading ${progress}%`;
      });
      await this.deploy.extractUpdate((progress) => {
        loading.message = `Installing ${progress}%`;
      });
      loading.dismiss();
      await this.deploy.reloadApp();
    }
  }
}
