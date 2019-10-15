import { Component } from '@angular/core';
import { ViewController, AlertController } from 'ionic-angular';
import { Bdd } from '../../providers/bdd';

@Component({
  template: `
      <ion-list>
        <button ion-item (click)="deleteAllTasks()"><ion-icon name="trash"></ion-icon>Delete all tasks</button>
        <button ion-item (click)="deleteAllCheckedTasks()"><ion-icon name="trash"></ion-icon>Delete all checked tasks</button>
      </ion-list>
    `
})

export class TaskPopoverPage {

  ProjectId: number;

  constructor(public bdd: Bdd, public alertCtrl: AlertController, public viewCtrl: ViewController) {

  }

  deleteAllTasks() {
    this.viewCtrl.dismiss('all');
  }

  deleteAllCheckedTasks() {
    this.viewCtrl.dismiss('checked');
  }
}