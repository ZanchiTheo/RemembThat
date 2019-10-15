import { Component } from '@angular/core';
import { NavController, MenuController } from 'ionic-angular';
import { HomePage } from '../home/home';

@Component({
  selector: 'page-welcome',
  templateUrl: 'welcome.html'
})
export class WelcomePage {

  tests = [{ testid: 3, testname: 'le test', testchecked: 'false' }, { testid: 2, testname: 'le test 2', testchecked: 'false' }];

  constructor(public navCtrl: NavController, public menu: MenuController) {

  }

  ionViewDidEnter() {
    // the root left menu should be disabled on the tutorial page
    this.menu.enable(true);
  }

  ionViewWillLeave() {
    // enable the root left menu when leaving the tutorial page
    this.menu.enable(false);
  }

  StartApp() {
    this.navCtrl.setRoot(HomePage);
  }

  checkedornot(event, test) {
    if (test.testchecked == 'true') {
      test.testchecked = 'false';
    }
    else if (test.testchecked == 'false') {
      test.testchecked = 'true';
    }
  }

}
