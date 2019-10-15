import { Component } from '@angular/core';
import { NavController, NavParams, MenuController, AlertController, LoadingController, ActionSheetController } from 'ionic-angular';
import { TaskPage } from '../task/task';
import { Bdd } from '../../providers/bdd';
import { User } from '../../providers/user';
import { Toast } from '@ionic-native/toast';

@Component({
  selector: 'page-project',
  templateUrl: 'project.html'
})
export class ProjectPage {

  Projects;
  UserName: string;
  UserId: number;

  constructor(public actionSheetCtrl: ActionSheetController, public loadingCtrl: LoadingController, public navCtrl: NavController, public navParams: NavParams, public menu: MenuController, public bdd: Bdd, public user: User, public toast: Toast, public alertCtrl: AlertController) {
    this.getNameAndId()
      .then(() => {
        this.bdd.createDataBase();
        this.printProjects();
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

  getProjects() {
    return this.bdd.getUserProjects(this.UserId)
      .then(projects => {
        this.Projects = [];
        this.Projects = projects;
      })
      .catch(e => { this.toast.show('erreur ' + e, '5000', 'center').subscribe(toast => { console.log(toast); }); });
  }

  printProjects() {
    /*let loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });
    loading.present();*/
    this.getProjects()
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

  fillNewProject() {
    let prompt = this.alertCtrl.create({
      title: 'Create New Project',
      message: "Enter a name for this awesome new project",
      inputs: [{ name: 'name', placeholder: 'name' }, { name: 'description', placeholder: 'description' }],
      buttons: [{ text: 'Cancel', role: 'cancel' },
      {
        text: 'Add',
        handler: data => {
          this.bdd.createUserProject(data.name, data.description, this.UserId)
            .then(() => {
              this.printProjects();
            });
        }
      }]
    });
    prompt.present();
  }

  addProject() {
    this.fillNewProject();
  }

  goToTaskPage(event, Project) {
    this.navCtrl.push(TaskPage, { userid: this.UserId, username: this.UserName, project: Project });
  }

  modifieProject(Project) {
    let prompt = this.alertCtrl.create({
      title: 'Change Project name',
      message: "Enter a new name and description",
      inputs: [{ name: 'name', placeholder: Project.ProjectName }, { name: 'description', placeholder: Project.ProjectDescription }],
      buttons: [{ text: 'Cancel', role: 'cancel' },
      {
        text: 'Save',
        handler: data => {
          this.bdd.updateProject(Project.ProjectId, data.name, data.description)
            .then(() => {
              this.printProjects();
            });
        }
      }]
    });
    prompt.present();
  }

  presentActions(event, Project) {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Project',
      buttons: [
        {
          text: 'Delete',
          role: 'destructive',
          icon: 'trash',
          handler: () => {
            this.bdd.deleteUserProject(Project.ProjectId)
              .then(() => {
                this.printProjects();
              })
          }
        },
        {
          text: 'Mofidie',
          role: 'destructive',
          icon: 'build',
          handler: () => {
            this.modifieProject(Project);
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