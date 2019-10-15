import { Injectable } from '@angular/core';
import { NativeStorage } from '@ionic-native/native-storage';
import { Toast } from '@ionic-native/toast';

@Injectable()
export class User {

    constructor(private nativeStorage: NativeStorage, public toast: Toast) {

    }

    public setUserInfo(username: string, userid: number) {
        return this.nativeStorage.setItem('User', { name: username, id: userid })
            .catch(e => { this.toast.show('erreur '+ e, '5000', 'center').subscribe(toast => { console.log(toast); }); });
    }

    public getUserInfo() {
        return this.nativeStorage.getItem('User')
            .then(data => {
                return(data ? data : 404)    
            })
            .catch(e => { this.toast.show('erreur '+ e, '5000', 'center').subscribe(toast => { console.log(toast); }); });
    }
}