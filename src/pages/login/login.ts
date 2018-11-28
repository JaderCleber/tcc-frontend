import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Storage } from '@ionic/storage';
import { Profile } from '../profile/profile';
import { AlertController } from 'ionic-angular';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class LoginPage {

  email: string;
  password: string;
  data: Observable<any>;

  constructor(
    public navCtrl: NavController,
    public http: HttpClient,
    private storage: Storage,
    private alertCtrl: AlertController) {
    this.storage.clear();
  }

  handleLogin() {
    let formLogin = new FormData();
    formLogin.append('email', this.email);
    formLogin.append('password', this.password);

    this.data = this.http.post('http://tcc-app-2018.xyz/login.php', formLogin);
    this.data.subscribe(data => {
      if (data.success) {
        this.storage.set('user', JSON.stringify(data.user));
        this.storage.set('client', JSON.stringify(data.client));
        this.navCtrl.push(Profile);
      } else {
        let alert = this.alertCtrl.create({
          title: 'Acesso Negado',
          subTitle: 'A senha informada está incorreta',
          buttons: ['Ok']
        });
        alert.present();
      }
    });
  }
}
