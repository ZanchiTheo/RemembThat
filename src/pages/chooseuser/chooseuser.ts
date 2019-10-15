import { Component } from '@angular/core';
import { NavController, MenuController, AlertController, LoadingController } from 'ionic-angular';
import { HomePage } from '../home/home';
import { DashboardPage } from '../dashboard/dashboard';
import { Bdd } from '../../providers/bdd';
import { Toast } from '@ionic-native/toast';
import { User } from '../../providers/user';

@Component({
  selector: 'page-chooseuser',
  templateUrl: 'chooseuser.html'
})
export class ChooseUserPage {

  Users;

  constructor(public loadingCtrl: LoadingController, public alertCtrl: AlertController, public navCtrl: NavController, public menu: MenuController, public bdd: Bdd, public user: User, public toast: Toast) {
    this.bdd.createDataBase();
    this.printUsers();
  }

  ionViewDidEnter() {
    // the root left menu should be disabled on the tutorial page
    this.menu.enable(false);
  }

  ionViewWillLeave() {
    // enable the root left menu when leaving the tutorial page
    this.menu.enable(true);
  }

  getUsers() {
    return this.bdd.selectUsers()
      .then(users => {
        this.Users = [];
        this.Users = users;
      })
      .catch(e => { this.toast.show('erreur ' + e, '5000', 'center').subscribe(toast => { console.log(toast); }); });
  }

  printUsers() {
    /*let loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });
    loading.present();*/
    this.getUsers()
    /*  .then(() => {
        loading.dismiss();
      })
      .catch(e => { this.toast.show('erreur ' + e, '5000', 'center').subscribe(toast => { console.log(toast); }); });*/
  }

  returnHomePage() {
    this.navCtrl.setRoot(HomePage, {}, {
      animate: true,
      direction: 'forward'
    });
  }

  goToUserDashboard(event, User) {
    this.user.setUserInfo(User.UserName, User.UserId)
      .then(() => {
        this.navCtrl.setRoot(DashboardPage);
      })
      .catch(e => { this.toast.show('erreur' + e, '5000', 'center').subscribe(toast => { console.log(toast); }); });
  }

  deleteUserClicked(event, User) {
    this.bdd.deleteUser(User.UserId)
      .then(() => {
        this.printUsers();
      })
      .catch(e => { this.toast.show('erreur' + e, '5000', 'center').subscribe(toast => { console.log(toast); }); });
  }
}