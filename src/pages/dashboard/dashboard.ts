import { Component } from '@angular/core';
import { NavController, NavParams, MenuController, } from 'ionic-angular';
import { HomePage } from '../home/home';
import { ProjectPage } from '../project/project';
import { ListPage } from '../list/list';
import { Bdd } from '../../providers/bdd';
import { User } from '../../providers/user';
import { Toast } from '@ionic-native/toast';

@Component({
  selector: 'page-dashboard',
  templateUrl: 'dashboard.html'
})
export class DashboardPage {

  UserName: string;
  UserId: number;
  numberProject: number;
  numberList: number;
  numberTasksNotChecked: number;
  numberTasks: number;
  numberItemsNotChecked: number;
  numberItems: number;

  constructor(public navCtrl: NavController, public navParams: NavParams, public menu: MenuController, public bdd: Bdd, public user: User, public toast: Toast) {
    this.getNameAndId()
      .then(() => {
        this.bdd.createDataBase();
        this.getAllCounts();
      });
  }

  ionViewDidEnter() {
    // the root left menu should be disabled on the tutorial page
    this.menu.enable(true);
  }

  ionViewWillLeave() {
    // enable the root left menu when leaving the tutorial page
    this.menu.enable(false);
  }

  getNameAndId() {
    return this.user.getUserInfo()
      .then(data => {
        this.UserName = data.name;
        this.UserId = parseInt(data.id);
      })
      .catch(e => { this.toast.show('erreur ' + e, '5000', 'center').subscribe(toast => { console.log(toast); }); });
  }

  getAllCounts() {
    this.bdd.countUserProjects(this.UserId)
      .then(count => { this.numberProject = parseInt(count); })
      .catch(e => { this.toast.show(e, '5000', 'center').subscribe(toast => { console.log(toast); }); });
    this.bdd.countUserLists(this.UserId)
      .then(count => { this.numberList = parseInt(count); })
      .catch(e => { this.toast.show(e, '5000', 'center').subscribe(toast => { console.log(toast); }); });
    this.bdd.countUserTasks(this.UserId)
      .then(count => { this.numberTasks = parseInt(count); })
      .catch(e => { this.toast.show(e, '5000', 'center').subscribe(toast => { console.log(toast); }); });
    this.bdd.countUserTasksNotChecked(this.UserId)
      .then(count => { this.numberTasksNotChecked = parseInt(count); })
      .catch(e => { this.toast.show(e, '5000', 'center').subscribe(toast => { console.log(toast); }); });
    this.bdd.countUserItems(this.UserId)
      .then(count => { this.numberItems = parseInt(count); })
      .catch(e => { this.toast.show(e, '5000', 'center').subscribe(toast => { console.log(toast); }); });
    this.bdd.countUserItemsNotChecked(this.UserId)
      .then(count => { this.numberItemsNotChecked = parseInt(count); })
      .catch(e => { this.toast.show(e, '5000', 'center').subscribe(toast => { console.log(toast); }); });
  }

  returnHomePage() {
    this.navCtrl.setRoot(HomePage, {}, {
      animate: true,
      direction: 'forward'
    });
  }

  goToProjectPage() {
    this.navCtrl.setRoot(ProjectPage);
  }

  goToListPage() {
    this.navCtrl.setRoot(ListPage);
  }
}