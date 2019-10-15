import { Component } from '@angular/core';
import { NavController, MenuController, ToastController } from 'ionic-angular';
import { HomePage } from '../home/home';
import { Toast } from '@ionic-native/toast';
import { Bdd } from '../../providers/bdd';

@Component({
  selector: 'page-createuser',
  templateUrl: 'createuser.html'
})
export class CreateUserPage {

  Name: string;
  Users;

  constructor(public toast: Toast, public navCtrl: NavController, public menu: MenuController, public bdd: Bdd, public toastCtrl: ToastController) {
    this.bdd.createDataBase();
    this.saveUsers();
  }

  ionViewDidEnter() {
    // the root left menu should be disabled on the tutorial page
    this.menu.enable(false);
  }

  ionViewWillLeave() {
    // enable the root left menu when leaving the tutorial page
    this.menu.enable(false);
  }

  getUsers() {
    return this.bdd.selectUsers()
      .then(users => {
        this.Users = [];
        this.Users = users;
      })
      .catch(e => { this.toast.show('erreur ' + e, '5000', 'center').subscribe(toast => { console.log(toast); }); });
  }

  saveUsers() {
    this.getUsers()
  }

  returnHomePage() {
    this.navCtrl.push(HomePage);
  }

  checkUsers(name: string): boolean {
    let res: boolean = true;
    for (let user of this.Users) {
      if (name.localeCompare(user.UserName) == 0) {
        res = false;
      }
    }
    return (res);
  }

  createNewUser(): void {
    if (this.Name != undefined) {
      let res: boolean = this.checkUsers(this.Name);
      if (res == true) {
        this.returnHomePage();
        this.bdd.createUser(this.Name);
        let toast = this.toastCtrl.create({
          message: 'User was created successfully, you welcome !',
          duration: 3000,
          position: 'top'
        });
        toast.present();
      }
      else if (res == false) {
        let toast = this.toastCtrl.create({
          message: 'Sorry but this Username is already use ...',
          duration: 3000,
          position: 'top',
          showCloseButton: true,
          closeButtonText: 'OK'
        });
        toast.present();
      }
    }
  }
}