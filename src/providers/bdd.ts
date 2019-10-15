import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { Toast } from '@ionic-native/toast';

const BddName: string = 'data.db';

@Injectable()
export class Bdd {

    private db: SQLiteObject;

    constructor(public sqlite: SQLite, public toast: Toast) {

    }

    public deleteTables() {
        this.db.executeSql('DROP TABLE `Item`', {})
            .then(() => {
                this.db.executeSql('DROP TABLE `Task`', {})
                    .then(() => {
                        this.db.executeSql('DROP TABLE `List`', {})
                            .then(() => {
                                this.db.executeSql('DROP TABLE `Project`', {})
                                    .then(() => {
                                        this.db.executeSql('DROP TABLE `User`', {})
                                            .then(() => { });
                                    });
                            });
                    });
            });
    }

    public createDataBase(): void {
        this.sqlite.create({
            name: BddName,
            location: 'default'
        })
            .then((db: SQLiteObject) => {
                console.log('bdd crée !');
                this.db = db;
                this.createTables();
            })
    }

    private createTables(): void {
        this.db.executeSql('CREATE TABLE IF NOT EXISTS "User" ( `UserId` INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, `UserName` TEXT NOT NULL UNIQUE )', {})
            .then(() => {
                console.log('table user created !');
                this.db.executeSql('CREATE TABLE IF NOT EXISTS "Project" ( `ProjectId` INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, `ProjectName` TEXT NOT NULL, `ProjectDescription` TEXT, `UserId` INTEGER NOT NULL, FOREIGN KEY(`UserId`) REFERENCES `User`(`UserId`) ON DELETE CASCADE)', {})
                    .then(() => {
                        console.log('table project created !');
                        this.db.executeSql('CREATE TABLE IF NOT EXISTS "List" ( `ListId` INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, `ListName` TEXT NOT NULL, `UserId` INTEGER NOT NULL, FOREIGN KEY(`UserId`) REFERENCES `User`(`UserId`) ON DELETE CASCADE)', {})
                            .then(() => {
                                console.log('table list created !');
                                this.db.executeSql('CREATE TABLE IF NOT EXISTS "Task" ( `TaskId` INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, `TaskName` TEXT NOT NULL, `TaskDescription` TEXT, `ProjectId` INTEGER NOT NULL, `TaskChecked` TEXT NOT NULL DEFAULT `false`, FOREIGN KEY(`ProjectId`) REFERENCES `Project`(`ProjectId`) ON DELETE CASCADE)', {})
                                    .then(() => {
                                        console.log('table task created !');
                                        this.db.executeSql('CREATE TABLE IF NOT EXISTS "Item" ( `ItemId` INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, `ItemName` TEXT NOT NULL, `ListId` INTEGER NOT NULL, `ItemChecked` TEXT NOT NULL DEFAULT `false`, FOREIGN KEY(`ListId`) REFERENCES `List`(`ListId`) ON DELETE CASCADE)', {})
                                            .then(() => {
                                                console.log('table item created !');
                                            }).catch(e => console.log(e));
                                    }).catch(e => console.log(e));
                            }).catch(e => console.log(e));
                    }).catch(e => console.log(e));
            }).catch(e => console.log(e));
    }

    public selectUsers() {
        let res = [];
        return this.db.executeSql('SELECT * FROM User', [])
            .then((data) => {
                for (let i = 0; i < data.rows.length; i++) {
                    res.push({
                        UserId: data.rows.item(i).UserId,
                        UserName: data.rows.item(i).UserName
                    });
                }
                return (res);
            }).catch(e => { this.toast.show(e, '5000', 'center').subscribe(toast => { console.log(toast); }); });
    }

    public getUserId(name: string) {
        return this.db.executeSql('SELECT UserId FROM User WHERE UserName = \'' + name + '\'', {})
            .then(data => {
                return (data.rows.length ? data.rows.item(0).UserId : null);
            })
            .catch(e => { this.toast.show(e, '5000', 'center').subscribe(toast => { console.log(toast); }); });
    }

    public createUser(name: string) {
        return this.db.executeSql('INSERT INTO `User`(UserName) VALUES(\'' + name + '\')', {})
            .catch(e => { this.toast.show(e, '5000', 'center').subscribe(toast => { console.log(toast); }); });
    }

    public getUserProjects(userid: number) {
        let res = [];
        return this.db.executeSql('SELECT * FROM Project WHERE UserId = \'' + userid + '\'', {})
            .then(data => {
                for (let i = 0; i < data.rows.length; i++) {
                    res.push({
                        ProjectId: data.rows.item(i).ProjectId,
                        ProjectName: data.rows.item(i).ProjectName,
                        ProjectDescription: data.rows.item(i).ProjectDescription
                    });
                }
                return (res);
            })
            .catch(e => { this.toast.show(e, '5000', 'center').subscribe(toast => { console.log(toast); }); });
    }

    public getUserLists(userid: number) {
        let res = [];
        return this.db.executeSql('SELECT * FROM List WHERE UserId = \'' + userid + '\'', {})
            .then(data => {
                for (let i = 0; i < data.rows.length; i++) {
                    res.push({
                        ListId: data.rows.item(i).ListId,
                        ListName: data.rows.item(i).ListName,
                    });
                }
                return (res);
            })
            .catch(e => { this.toast.show(e, '5000', 'center').subscribe(toast => { console.log(toast); }); });
    }

    public createUserProject(name: string, description: string, userid: number) {
        return this.db.executeSql('INSERT INTO `Project`(ProjectName, ProjectDescription, UserId) VALUES(\'' + name + '\', \'' + description + '\', \'' + userid + '\')', {})
            .catch(e => { this.toast.show(e, '5000', 'center').subscribe(toast => { console.log(toast); }); });
    }

    public createUserList(name: string, userid: number) {
        return this.db.executeSql('INSERT INTO `List`(ListName, UserId) VALUES(\'' + name + '\', \'' + userid + '\')', {})
            .catch(e => { this.toast.show(e, '5000', 'center').subscribe(toast => { console.log(toast); }); });
    }

    public countUserProjects(userid: number) {
        return this.db.executeSql('SELECT COUNT(ProjectId) AS numberProject FROM Project WHERE (UserId = \'' + userid + '\')', {})
            .then((data) => {
                return (data.rows.length ? data.rows.item(0).numberProject : null);
            })
            .catch(e => { this.toast.show(e, '5000', 'center').subscribe(toast => { console.log(toast); }); });
    }

    public countUserLists(userid: number) {
        return this.db.executeSql('SELECT COUNT(ListId) AS numberList FROM List WHERE (UserId = \'' + userid + '\')', {})
            .then(data => {
                return (data.rows.length ? data.rows.item(0).numberList : null);
            })
            .catch(e => { this.toast.show(e, '5000', 'center').subscribe(toast => { console.log(toast); }); });
    }

    public countUserTasksNotChecked(userid: number) {
        return this.db.executeSql('SELECT COUNT(TaskId) AS numberTasksNotChecked FROM Task INNER JOIN Project USING(ProjectId) WHERE (UserId = \'' + userid + '\') AND (TaskChecked = \'false\')', {})
            .then((data) => {
                return (data.rows.length ? data.rows.item(0).numberTasksNotChecked : null);
            })
            .catch(e => { this.toast.show(e, '5000', 'center').subscribe(toast => { console.log(toast); }); });
    }

    public countUserTasks(userid: number) {
        return this.db.executeSql('SELECT COUNT(TaskId) AS numberTasks FROM Task INNER JOIN Project USING(ProjectId) WHERE (UserId = \'' + userid + '\')', {})
            .then((data) => {
                return (data.rows.length ? data.rows.item(0).numberTasks : null);
            })
            .catch(e => { this.toast.show(e, '5000', 'center').subscribe(toast => { console.log(toast); }); });
    }

    public countUserItemsNotChecked(userid: number) {
        return this.db.executeSql('SELECT COUNT(ItemId) AS numberItemsNotChecked FROM Item INNER JOIN List USING(ListId) WHERE (UserId = \'' + userid + '\') AND (ItemChecked = \'false\')', {})
            .then((data) => {
                return (data.rows.length ? data.rows.item(0).numberItemsNotChecked : null);
            })
            .catch(e => { this.toast.show(e, '5000', 'center').subscribe(toast => { console.log(toast); }); });
    }

    public countUserItems(userid: number) {
        return this.db.executeSql('SELECT COUNT(ItemId) AS numberItems FROM Item INNER JOIN List USING(ListId) WHERE (UserId = \'' + userid + '\')', {})
            .then((data) => {
                return (data.rows.length ? data.rows.item(0).numberItems : null);
            })
            .catch(e => { this.toast.show(e, '5000', 'center').subscribe(toast => { console.log(toast); }); });
    }

    public getListItems(listid: number) {
        let res = [];
        return this.db.executeSql('SELECT * FROM Item WHERE ListId = \'' + listid + '\'', {})
            .then(data => {
                for (let i = 0; i < data.rows.length; i++) {
                    res.push({
                        ItemId: data.rows.item(i).ItemId,
                        ItemName: data.rows.item(i).ItemName,
                        ItemChecked: data.rows.item(i).ItemChecked
                    });
                }
                return (res);
            })
            .catch(e => { this.toast.show(e, '5000', 'center').subscribe(toast => { console.log(toast); }); });
    }

    public getProjectTasks(projectid: number) {
        let res = [];
        return this.db.executeSql('SELECT * FROM Task WHERE ProjectId = \'' + projectid + '\'', {})
            .then(data => {
                for (let i = 0; i < data.rows.length; i++) {
                    res.push({
                        TaskId: data.rows.item(i).TaskId,
                        TaskName: data.rows.item(i).TaskName,
                        TaskDescription: data.rows.item(i).TaskDescription,
                        TaskChecked: data.rows.item(i).TaskChecked
                    });
                }
                return (res);
            })
            .catch(e => { this.toast.show(e, '5000', 'center').subscribe(toast => { console.log(toast); }); });
    }

    public createProjectTask(name: string, description: string, projectid: number) {
        return this.db.executeSql('INSERT INTO `Task`(TaskName, TaskDescription, ProjectId) VALUES(\'' + name + '\', \'' + description + '\', \'' + projectid + '\')', {})
            .catch(e => { this.toast.show(e, '5000', 'center').subscribe(toast => { console.log(toast); }); });
    }

    public createListItem(name: string, listid: number) {
        return this.db.executeSql('INSERT INTO `Item`(ItemName, ListId) VALUES(\'' + name + '\', \'' + listid + '\')', {})
            .catch(e => { this.toast.show(e, '5000', 'center').subscribe(toast => { console.log(toast); }); });
    }

    public deleteListItem(itemid: number) {
        return this.db.executeSql('DELETE FROM Item WHERE ItemId = \'' + itemid + '\'', {})
            .catch(e => { this.toast.show(e, '5000', 'center').subscribe(toast => { console.log(toast); }); });
    }

    public deleteAllItems(listid: number) {
        return this.db.executeSql('DELETE FROM Item WHERE ListId = \'' + listid + '\'', {})
            .catch(e => { this.toast.show(e, '5000', 'center').subscribe(toast => { console.log(toast); }); });
    }

    public deleteAllCheckedItems(listid: number) {
        return this.db.executeSql('DELETE FROM Item WHERE (ListId = \'' + listid + '\') AND (ItemChecked = \'true\')', {})
            .catch(e => { this.toast.show(e, '5000', 'center').subscribe(toast => { console.log(toast); }); });
    }

    public deleteProjectTask(taskid: number) {
        return this.db.executeSql('DELETE FROM Task WHERE TaskId = \'' + taskid + '\'', {})
            .catch(e => { this.toast.show(e, '5000', 'center').subscribe(toast => { console.log(toast); }); });
    }

    public deleteAllTasks(projectid: number) {
        return this.db.executeSql('DELETE FROM Task WHERE ProjectId = \'' + projectid + '\'', {})
            .catch(e => { this.toast.show(e, '5000', 'center').subscribe(toast => { console.log(toast); }); });
    }

    public deleteAllCheckedTasks(projectid: number) {
        return this.db.executeSql('DELETE FROM Task WHERE (ProjectId = \'' + projectid + '\') AND (TaskChecked = \'true\')', {})
            .catch(e => { this.toast.show(e, '5000', 'center').subscribe(toast => { console.log(toast); }); });
    }

    public deleteUserProject(projectid: number) {
        return this.db.executeSql('DELETE FROM Project WHERE ProjectId = \'' + projectid + '\'', {})
            .catch(e => { this.toast.show(e, '5000', 'center').subscribe(toast => { console.log(toast); }); });
    }

    public deleteUserList(listid: number) {
        return this.db.executeSql('DELETE FROM List WHERE ListId = \'' + listid + '\'', {})
            .catch(e => { this.toast.show(e, '5000', 'center').subscribe(toast => { console.log(toast); }); });
    }

    public deleteUser(userid: number) {
        return this.db.executeSql('DELETE FROM User WHERE UserId = \'' + userid + '\'', {})
            .catch(e => { this.toast.show(e, '5000', 'center').subscribe(toast => { console.log(toast); }); });
    }

    public updateCheckTask(taskid: number) {
        return this.db.executeSql('UPDATE Task SET TaskChecked = \'true\' WHERE TaskId = \'' + taskid + '\'', {})
            .catch(e => { this.toast.show(e, '5000', 'center').subscribe(toast => { console.log(toast); }); });
    }

    public updateUncheckTask(taskid: number) {
        return this.db.executeSql('UPDATE Task SET TaskChecked = \'false\' WHERE TaskId = \'' + taskid + '\'', {})
            .catch(e => { this.toast.show(e, '5000', 'center').subscribe(toast => { console.log(toast); }); });
    }

    public updateCheckItem(itemid: number) {
        return this.db.executeSql('UPDATE Item SET ItemChecked = \'true\' WHERE ItemId = \'' + itemid + '\'', {})
            .catch(e => { this.toast.show(e, '5000', 'center').subscribe(toast => { console.log(toast); }); });
    }

    public updateUncheckItem(itemid: number) {
        return this.db.executeSql('UPDATE Item SET ItemChecked = \'false\' WHERE ItemId = \'' + itemid + '\'', {})
            .catch(e => { this.toast.show(e, '5000', 'center').subscribe(toast => { console.log(toast); }); });
    }

    public updateTask(taskid: number, taskname: string, taskdescription: string) {
        return this.db.executeSql('UPDATE Task SET TaskName = \'' + taskname + '\' WHERE TaskId = \'' + taskid + '\'', {})
            .then(() => {
                this.db.executeSql('UPDATE Task SET TaskDescription = \'' + taskdescription + '\' WHERE TaskId = \'' + taskid + '\'', {})
                    .catch(e => { this.toast.show(e, '5000', 'center').subscribe(toast => { console.log(toast); }); });
            })
            .catch(e => { this.toast.show(e, '5000', 'center').subscribe(toast => { console.log(toast); }); });
    }

    public updateItem(itemid: number, itemname: string) {
        return this.db.executeSql('UPDATE Item SET ItemName = \'' + itemname + '\' WHERE ItemId = \'' + itemid + '\'', {})
            .catch(e => { this.toast.show(e, '5000', 'center').subscribe(toast => { console.log(toast); }); });
    }

    public updateProject(projectid: number, projectname: string, projectdescription: string) {
        return this.db.executeSql('UPDATE Project SET ProjectName = \'' + projectname + '\' WHERE ProjectId = \'' + projectid + '\'', {})
            .then(() => {
                this.db.executeSql('UPDATE Project SET ProjectDescription = \'' + projectdescription + '\' WHERE ProjectId = \'' + projectid + '\'', {})
                    .catch(e => { this.toast.show(e, '5000', 'center').subscribe(toast => { console.log(toast); }); });
            })
            .catch(e => { this.toast.show(e, '5000', 'center').subscribe(toast => { console.log(toast); }); });
    }

    public updateList(listid: number, listname: string) {
        return this.db.executeSql('UPDATE List SET ListName = \'' + listname + '\' WHERE ListId = \'' + listid + '\'', {})
            .catch(e => { this.toast.show(e, '5000', 'center').subscribe(toast => { console.log(toast); }); });
    }
}

