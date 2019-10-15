import { Component } from '@angular/core';
import { NavController, MenuController, LoadingController, AlertController, NavParams, PopoverController } from 'ionic-angular';
import { ItemPopoverPage } from '../popovers/itempopover';
import { Bdd } from '../../providers/bdd';
import { Toast } from '@ionic-native/toast';

@Component({
    selector: 'page-item',
    templateUrl: 'item.html'
})

export class ItemPage {

    Items;
    ListId: number;
    value;

    constructor(public popoverCtrl: PopoverController, private navParams: NavParams, public alertCtrl: AlertController, public toast: Toast, public loadingCtrl: LoadingController, public navCtrl: NavController, public menu: MenuController, public bdd: Bdd) {
        let List = this.navParams.get('list');
        this.ListId = parseInt(List.ListId);
        this.bdd.createDataBase();
        this.printItems();
    }

    ionViewDidEnter() {
        // the root left menu should be disabled on the tutorial page
        this.menu.enable(false);
    }

    ionViewWillLeave() {
        // enable the root left menu when leaving the tutorial page
        this.menu.enable(false);
    }

    getItems() {
        return this.bdd.getListItems(this.ListId)
            .then(items => {
                this.Items = [];
                this.Items = items;
            })
            .catch(e => { this.toast.show('erreur ' + e, '5000', 'center').subscribe(toast => { console.log(toast); }); });
    }

    printItems() {
        /*let loading = this.loadingCtrl.create({
            content: 'Please wait...'
        });
        loading.present();*/
        this.getItems()
        /*.then(() => {
            loading.dismiss();
        })
        .catch(e => { this.toast.show('erreur ' + e, '5000', 'center').subscribe(toast => { console.log(toast); }); });*/
    }

    fillNewItem() {
        let prompt = this.alertCtrl.create({
            title: 'Create New Item',
            message: "Enter a name for this awesome new item",
            inputs: [{ name: 'name', placeholder: 'name' }],
            buttons: [{ text: 'Cancel', role: 'cancel' },
            {
                text: 'Add',
                handler: data => {
                    this.bdd.createListItem(data.name, this.ListId)
                        .then(() => {
                            this.printItems();
                        });
                }
            }]
        });
        prompt.present();
    }

    addItem() {
        this.fillNewItem();
    }

    modifieItem($event, Item) {
        let prompt = this.alertCtrl.create({
            title: 'Change Item name',
            message: "Enter a new name",
            inputs: [{ name: 'name', placeholder: Item.ItemName }],
            buttons: [{ text: 'Cancel', role: 'cancel' },
            {
                text: 'Save',
                handler: data => {
                    this.bdd.updateItem(Item.ItemId, data.name)
                        .then(() => {
                            this.printItems();
                        });
                }
            }]
        });
        prompt.present();
    }

    deleteItem(event, Item) {
        this.bdd.deleteListItem(Item.ItemId)
            .then(() => {
                this.printItems();
            })
    }

    checkOrNot(event, Item) {
        if (Item.ItemChecked == 'false') {
            this.bdd.updateCheckItem(Item.ItemId)
                .then(() => {
                    this.printItems();
                });
        }
        else if (Item.ItemChecked == 'true') {
            this.bdd.updateUncheckItem(Item.ItemId)
                .then(() => {
                    this.printItems();
                });
        }
    }

    presentPopover(event) {
        let popover = this.popoverCtrl.create(ItemPopoverPage);
        popover.present({
            ev: event
        });
        popover.onDidDismiss((data) => {
            if (data == 'all') {
                let prompt = this.alertCtrl.create({
                    title: 'Delete',
                    message: "All the items will be deleted",
                    buttons: [{ text: 'Cancel', role: 'cancel' },
                    {
                        text: 'Delete',
                        handler: data => {
                            this.bdd.deleteAllItems(this.ListId)
                                .then(() => {
                                    this.printItems();
                                })
                        }
                    }]
                });
                prompt.present();
            }
            else if (data == 'checked') {
                let prompt = this.alertCtrl.create({
                    title: 'Delete',
                    message: "All the checked items will be deleted",
                    buttons: [{ text: 'Cancel', role: 'cancel' },
                    {
                        text: 'Delete',
                        handler: data => {
                            this.bdd.deleteAllCheckedItems(this.ListId)
                                .then(() => {
                                    this.printItems();
                                })
                        }
                    }]
                });
                prompt.present();
            }
        });
    }
}