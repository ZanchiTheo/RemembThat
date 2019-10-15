import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { WelcomePage } from '../pages/welcome/welcome';
import { CreateUserPage } from '../pages/createuser/createuser';
import { ChooseUserPage } from '../pages/chooseuser/chooseuser';
import { ItemPage } from '../pages/item/item';
import { TaskPage } from '../pages/task/task';
import { DashboardPage } from '../pages/dashboard/dashboard';
import { ProjectPage } from '../pages/project/project';
import { ListPage } from '../pages/list/list';
import { ItemPopoverPage } from '../pages/popovers/itempopover';
import { TaskPopoverPage } from '../pages/popovers/taskpopover';

//providers
import { Bdd } from '../providers/bdd';
import { User } from '../providers/user';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

//natives imports 
import { SQLite } from '@ionic-native/sqlite';
import { Toast } from '@ionic-native/toast';
import { NativeStorage } from '@ionic-native/native-storage';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    WelcomePage,
    CreateUserPage,
    ChooseUserPage,
    DashboardPage,
    ProjectPage,
    ListPage,
    ItemPage,
    TaskPage,
    TaskPopoverPage,
    ItemPopoverPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    WelcomePage,
    CreateUserPage,
    ChooseUserPage,
    DashboardPage,
    ProjectPage,
    ListPage,
    ItemPage,
    TaskPage,
    TaskPopoverPage,
    ItemPopoverPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Toast,
    SQLite,
    NativeStorage,  
    Bdd,
    User,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
