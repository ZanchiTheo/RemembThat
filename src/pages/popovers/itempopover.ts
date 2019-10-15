import { Component } from '@angular/core';
import { ViewController, AlertController } from 'ionic-angular';
import { Bdd } from '../../providers/bdd';

@Component({
  template: `
      <ion-list>
        <button ion-item (click)="deleteAllItems()"><ion-icon name="trash"></ion-icon>    Delete all items</button>
        <button ion-item (click)="deleteAllCheckedItems()"><ion-icon name="trash"></ion-icon>    Delete all checked items</button>
      </ion-list>
    `
})

export class ItemPopoverPage {

  ListId: number;

  constructor(public bdd: Bdd, public alertCtrl: AlertController, public viewCtrl: ViewController) {

  }

  deleteAllItems() {
    this.viewCtrl.dismiss('all');
  }

  deleteAllCheckedItems() {
    this.viewCtrl.dismiss('checked');
  }

}