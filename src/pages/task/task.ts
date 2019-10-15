import { Component } from '@angular/core';
import { NavController, MenuController, LoadingController, AlertController, NavParams, PopoverController } from 'ionic-angular';
import { Bdd } from '../../providers/bdd';
import { Toast } from '@ionic-native/toast';
import { TaskPopoverPage } from '../popovers/taskpopover';

@Component({
    selector: 'page-task',
    templateUrl: 'task.html'
})

export class TaskPage {

    Tasks;
    ProjectId: number;
    value;

    constructor(public popoverCtrl: PopoverController, private navParams: NavParams, public alertCtrl: AlertController, public toast: Toast, public loadingCtrl: LoadingController, public navCtrl: NavController, public menu: MenuController, public bdd: Bdd) {
        let Project = this.navParams.get('project');
        this.ProjectId = parseInt(Project.ProjectId);
        this.bdd.createDataBase();
        this.printTasks();
    }

    ionViewDidEnter() {
        // the root left menu should be disabled on the tutorial page
        this.menu.enable(false);
    }

    ionViewWillLeave() {
        // enable the root left menu when leaving the tutorial page
        this.menu.enable(false);
    }

    getTasks() {
        return this.bdd.getProjectTasks(this.ProjectId)
            .then(tasks => {
                this.Tasks = [];
                this.Tasks = tasks;
            })
            .catch(e => { this.toast.show('erreur ' + e, '5000', 'center').subscribe(toast => { console.log(toast); }); });
    }

    printTasks() {
        /*let loading = this.loadingCtrl.create({
            content: 'Please wait...'
        });
        loading.present();*/
        this.getTasks()
        /*    .then(() => {
                loading.dismiss();
            })
            .catch(e => { this.toast.show('erreur ' + e, '5000', 'center').subscribe(toast => { console.log(toast); }); });*/
    }

    fillNewTask() {
        let prompt = this.alertCtrl.create({
            title: 'Create New Task',
            message: "Enter a name for this awesome new task",
            inputs: [{ name: 'name', placeholder: 'name' }, { name: 'description', placeholder: 'description' }],
            buttons: [{ text: 'Cancel', role: 'cancel' },
            {
                text: 'Add',
                handler: data => {
                    this.bdd.createProjectTask(data.name, data.description, this.ProjectId)
                        .then(() => {
                            this.printTasks();
                        });
                }
            }]
        });
        prompt.present();
    }

    addTask() {
        this.fillNewTask();
    }

    modifieTask($event, Task) {
        let prompt = this.alertCtrl.create({
            title: 'Change Task name',
            message: "Enter a new name and description",
            inputs: [{ name: 'name', placeholder: Task.TaskName }, { name: 'description', placeholder: Task.TaskDescription }],
            buttons: [{ text: 'Cancel', role: 'cancel' },
            {
                text: 'Save',
                handler: data => {
                    this.bdd.updateTask(Task.TaskId, data.name, data.description)
                        .then(() => {
                            this.printTasks();
                        });
                }
            }]
        });
        prompt.present();
    }

    deleteTask(event, Task) {
        this.bdd.deleteProjectTask(Task.TaskId)
            .then(() => {
                this.printTasks();
            })
    }

    checkOrNot(event, Task) {
        if (Task.TaskChecked == 'false') {
            this.bdd.updateCheckTask(Task.TaskId)
                .then(() => {
                    this.printTasks();
                });
        }
        else if (Task.TaskChecked == 'true') {
            this.bdd.updateUncheckTask(Task.TaskId)
                .then(() => {
                    this.printTasks();
                });
        }
    }

    presentPopover(event) {
        let popover = this.popoverCtrl.create(TaskPopoverPage);
        popover.present({
            ev: event
        });
        popover.onDidDismiss((data) => {
            if (data == 'all') {
                let prompt = this.alertCtrl.create({
                    title: 'Delete',
                    message: "All the tasks will be deleted",
                    buttons: [{ text: 'Cancel', role: 'cancel' },
                    {
                        text: 'Delete',
                        handler: data => {
                            this.bdd.deleteAllTasks(this.ProjectId)
                                .then(() => {
                                    this.printTasks();
                                })
                        }
                    }]
                });
                prompt.present();
            }
            else if (data == 'checked') {
                let prompt = this.alertCtrl.create({
                    title: 'Delete',
                    message: "All the checked tasks will be deleted",
                    buttons: [{ text: 'Cancel', role: 'cancel' },
                    {
                        text: 'Delete',
                        handler: data => {
                            this.bdd.deleteAllCheckedTasks(this.ProjectId)
                                .then(() => {
                                    this.printTasks();
                                })
                        }
                    }]
                });
                prompt.present();
            }
        });
    }
}
