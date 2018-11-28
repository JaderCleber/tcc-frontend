import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { AlertController } from 'ionic-angular';
import { LoginPage } from '../login/login';

@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html'
})
export class Profile {

  clientId: string;
  userId: string;
  data: Observable<any>;
  name: string;
  cep: string;
  address: string;
  number: string;
  state: string;
  city: string;
  phone: string;
  cpf: string;
  email: string;
  passwordCurrent: string;
  passwordNew: string;
  passwordConfirm: string;
  changePassword: boolean;

  constructor(
    public navCtrl: NavController,
    public http: HttpClient,
    private storage: Storage,
    private alertCtrl: AlertController) {
    this.storage.get('client').then((val) => {
      const client = JSON.parse(val);
      this.clientId = client.id;
      this.name = client.nome;
      this.cep = client.cep;
      this.address = client.endereco;
      this.number = client.numero;
      this.state = client.estado;
      this.city = client.municipio;
      this.phone = client.telefone;
      this.cpf = client.cpf;
    });
    this.storage.get('user').then((val) => {
      const user = JSON.parse(val);
      this.email = user.email;
      this.userId = user.codigo;
    });
    this.changePassword = false;
  }

  handleOpenChangePassword() {
    this.changePassword = !this.changePassword;
  }

  handleDeleteAccount() {
    let alert = this.alertCtrl.create({
      title: 'Confirmar Exclusão',
      message: 'Realmente deseja excluir sua conta?',
      buttons: [
        {
          text: 'CANCELAR',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Sim',
          handler: () => {
            const formDelete = new FormData();
            formDelete.append('client', this.clientId);
            formDelete.append('user', this.userId);
            this.data = this.http.post('http://tcc-app-2018.xyz/delete.php', formDelete);
            this.data.subscribe(data => {
              if (data.success) {
                this.storage.clear();
                let alert = this.alertCtrl.create({
                  title: 'Sucesso',
                  subTitle: 'Sua conta foi excluída com sucesso',
                  buttons: ['Ok']
                });
                alert.present();
                this.navCtrl.push(LoginPage);
              } else {
                let alert = this.alertCtrl.create({
                  title: 'Erro',
                  subTitle: 'Não foi possível excluir a conta',
                  buttons: ['Ok']
                });
                alert.present();
              }
            });
          }
        }
      ]
    });
    alert.present();
  }

  handleSave() {
    const formProfile = new FormData();
    formProfile.append('name', this.name);
    formProfile.append('cep', this.cep);
    formProfile.append('address', this.address);
    formProfile.append('number', this.number);
    formProfile.append('state', this.state);
    formProfile.append('city', this.city);
    formProfile.append('phone', this.phone);
    formProfile.append('cpf', this.cpf);
    formProfile.append('client', this.clientId);
    this.data = this.http.post('http://tcc-app-2018.xyz/client.php', formProfile);
    this.data.subscribe(data => {
      if (data.success) {
        this.storage.set("client", JSON.stringify({
          name: this.name,
          cep: this.cep,
          address: this.address,
          number: this.number,
          state: this.state,
          city: this.city,
          phone: this.phone,
          cpf: this.cpf,
        }));
        // this.navCtrl.push(LoginPage);
        let alert = this.alertCtrl.create({
          title: 'Sucesso',
          subTitle: 'As informações foram atualizadas com sucesso',
          buttons: ['Ok']
        });
        alert.present();
      } else {
        let alert = this.alertCtrl.create({
          title: 'Erro',
          subTitle: 'Não foi possível atualizar as informações',
          buttons: ['Ok']
        });
        alert.present();
      }
    });
  }

  handleChangePassword() {
    if (this.passwordNew !== this.passwordConfirm) {
      let alert = this.alertCtrl.create({
        title: 'Senhas desiguais',
        subTitle: 'As senhas inseridas nos campos de nova senha e confirmação são desiguais',
        buttons: ['Ok']
      });
      alert.present();
      return;
    }
    const formPassword = new FormData();
    formPassword.append('user', this.userId);
    formPassword.append('new', this.passwordNew);
    formPassword.append('current', this.passwordCurrent);
    this.data = this.http.post('http://tcc-app-2018.xyz/change-password.php', formPassword);
    this.data.subscribe(data => {
      if (data.success) {
        this.changePassword = false;
        let alert = this.alertCtrl.create({
          title: 'Sucesso',
          subTitle: 'A senha foi alterada com sucesso',
          buttons: ['Ok']
        });
        alert.present();
      } else {
        let alert = this.alertCtrl.create({
          title: 'Erro',
          subTitle: 'Não foi possível realizar a troca da senha',
          buttons: ['Ok']
        });
        alert.present();
      }
    });
  }
}
