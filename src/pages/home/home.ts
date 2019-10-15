import { Component } from '@angular/core';
import { NavController, MenuController, ModalController } from 'ionic-angular';
import { WelcomePage } from '../welcome/welcome';
import { CreateUserPage } from '../createuser/createuser';
import { ChooseUserPage } from '../chooseuser/chooseuser';
import { Bdd } from '../../providers/bdd';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public navCtrl: NavController, public menu: MenuController, public modalCtrl: ModalController, public bdd: Bdd) {
    this.bdd.createDataBase();
  }

  ionViewDidEnter() {
    // the root left menu should be disabled on the tutorial page
    this.menu.enable(false);
  }

  ionViewWillLeave() {
    // enable the root left menu when leaving the tutorial page
    this.menu.enable(false);
  }

  returnWelcomePage() {
    this.navCtrl.setRoot(WelcomePage);
  }

  showCreateUser() {
    this.navCtrl.setRoot(CreateUserPage);
  }

  showChooseUser() {
    this.navCtrl.setRoot(ChooseUserPage);
  }
}
