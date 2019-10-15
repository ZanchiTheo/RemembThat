import { Component } from '@angular/core';
import { NavController, NavParams, MenuController, AlertController, LoadingController, ActionSheetController } from 'ionic-angular';
import { ItemPage } from '../item/item';
import { Bdd } from '../../providers/bdd';
import { User } from '../../providers/user';
import { Toast } from '@ionic-native/toast';

@Component({
  selector: 'page-list',
  templateUrl: 'list.html'
})
export class ListPage {

  Lists;
  UserName: string;
  UserId: number;

  constructor(public actionSheetCtrl: ActionSheetController, public loadingCtrl: LoadingController, public navCtrl: NavController, public navParams: NavParams, public menu: MenuController, public bdd: Bdd, public user: User, public toast: Toast, public alertCtrl: AlertController) {
    this.getNameAndId()
      .then(() => {
        this.bdd.createDataBase();
        this.printLists();
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

  getLists() {
    return this.bdd.getUserLists(this.UserId)
      .then(lists => {
        this.Lists = [];
        this.Lists = lists;
      })
      .catch(e => { this.toast.show('erreur ' + e, '5000', 'center').subscribe(toast => { console.log(toast); }); });
  }

  printLists() {
    /*let loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });
    loading.present();*/
    this.getLists()
    /*  .then(() => {
        loading.dismiss();
      })
      .catch(e => { this.toast.show('erreur ' + e, '5000', 'center').subscribe(toast => { console.log(toast); }); });*/
  }

  getNameAndId() {
    return this.user.getUserInfo()
      .then(data => {
        this.UserName = data.name;
        this.UserId = parseInt(data.id);
      })
      .catch(e => { this.toast.show('erreur ' + e, '5000', 'center').subscribe(toast => { console.log(toast); }); });
  }

  fillNewList() {
    let prompt = this.alertCtrl.create({
      title: 'Create New List',
      message: "Enter a name for this awesome new list",
      inputs: [{ name: 'name', placeholder: 'name' }],
      buttons: [{ text: 'Cancel', role: 'cancel' },
      {
        text: 'Add',
        handler: data => {
          this.bdd.createUserList(data.name, this.UserId)
            .then(() => {
              this.printLists();
            });
        }
      }]
    });
    prompt.present();
  }

  addList() {
    this.fillNewList();
  }

  goToItemPage(event, List) {
    this.navCtrl.push(ItemPage, { userid: this.UserId, username: this.UserName, list: List });
  }

  modifieList(List) {
    let prompt = this.alertCtrl.create({
      title: 'Change List name',
      message: "Enter a new name",
      inputs: [{ name: 'name', placeholder: List.ListName }],
      buttons: [{ text: 'Cancel', role: 'cancel' },
      {
        text: 'Save',
        handler: data => {
          this.bdd.updateList(List.ListId, data.name)
            .then(() => {
              this.printLists();
            });
        }
      }]
    });
    prompt.present();
  }

  presentActions(event, List) {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Project',
      buttons: [
        {
          text: 'Delete',
          role: 'destructive',
          icon: 'trash',
          handler: () => {
            this.bdd.deleteUserList(List.ListId)
              .then(() => {
                this.printLists();
              })
          }
        },
        {
          text: 'Mofidie',
          role: 'destructive',
          icon: 'build',
          handler: () => {
            this.modifieList(List);
          }
        },
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    actionSheet.present();
  }

}
