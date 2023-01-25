import { Component, OnInit } from '@angular/core';
import { ContactAuthService } from '../services/contact-auth.service';
import {ReactiveFormsModule, Validators, FormBuilder, FormGroup } from '@angular/forms';
import { MenuController, NavController } from '@ionic/angular';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { LoadingController, Platform } from '@ionic/angular';
import firebase from 'firebase/compat/app';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { ContactAccessService } from '../services/contact-acess.service';

@Component({
  selector: 'app-athentification',
  templateUrl: './athentification.page.html',
  styleUrls: ['./athentification.page.scss'],
})
export class AthentificationPage implements OnInit {
  private authForm: FormGroup;
  public loading: any;
  public isGoogleLogin = false;
  public user = null;
  private inscriptionForm: FormGroup;


  constructor(private fireauth:ContactAuthService, 
    private formBuilder: FormBuilder, 
    private navCtrl: NavController, 
    private menuCtrl: MenuController,
    private google: GooglePlus,
    public loadingController: LoadingController,
    private fireAuth: AngularFireAuth,
    private platform: Platform,
    private firestore: ContactAccessService,

    ) {
    this.menuCtrl.enable(false);
   
  }

  async ngOnInit() {
    this.authForm = this.formBuilder.group
    ({
      email: [''],
      password: [''],
    });

    this.loading = await this.loadingController.create({
      message: 'Connecting ...'
    });
  }

  signIn(){
    this.fireauth.signIn(this.authForm.value)
    .then(res => {
      console.log(res);
      this.navCtrl.navigateForward('/liste-contacts');

    }, err => {
      console.log(err);
    })
  }

  signUp(){
    this.navCtrl.navigateForward('/inscription');
  }

  doLogin(){
    let params: any;
    if (this.platform.is('cordova')) {
      if (this.platform.is('android')) {
        params = {
          webClientId: '<WEB_CLIENT_ID>', //  webclientID 'string'
          offline: true
        };
      } else {
        params = {};
      }
      this.google.login(params)
      .then((response) => {
        console.log("hyyyyyyy", response);
        const { idToken, accessToken } = response;
        this.onLoginSuccess(idToken, accessToken);
      }).catch((error) => {
        console.log(error);
        alert('error:' + JSON.stringify(error));
      });
    } else{
      console.log('else...');
      this.fireAuth.signInWithPopup(new firebase.auth.GoogleAuthProvider()).then(success => {
        console.log('success in google login', success);
        this.inscriptionForm = this.formBuilder.group({
          email: success.additionalUserInfo.profile['email'],
          image: success.additionalUserInfo.profile['picture'],
          nom: success.additionalUserInfo.profile['family_name'],
          password: [''],
          prenom: success.additionalUserInfo.profile['given_name'],
          tel: [''],
        });
        this.firestore.newCompte((this.inscriptionForm.value))

       /* this.fireauth.singUp(this.inscriptionForm.value)
        .then(res => {
          console.log(res);
          this.firestore.newCompte((this.inscriptionForm.value))
          this.navCtrl.navigateForward('/authentification');
        }, err => {
          console.log("erreur = ", err);
        })*/

        this.isGoogleLogin = true;
        this.user =  success.user;
        this.navCtrl.navigateForward('/liste-contacts');
      }).catch(err => {
        console.log(err.message, 'error in google login');
      });
    }
  }


  /*
 this.email = email;
        this.image = image;
        this.nom = nom;
        this.password = password;
        this.prenom = prenom;
        this.tel = tel;  
  signUp() {
    this.fireauth.singUp(this.inscriptionForm.value)
    .then(res => {
      console.log(res);
      this.firestore.newCompte((this.inscriptionForm.value))
      this.navCtrl.navigateForward('/authentification');
    }, err => {
      console.log("erreur = ", err);
    })
  }
  */
  onLoginSuccess(accessToken, accessSecret) {
    const credential = accessSecret ? firebase.auth.GoogleAuthProvider
        .credential(accessToken, accessSecret) : firebase.auth.GoogleAuthProvider
            .credential(accessToken);
    this.fireAuth.signInWithCredential(credential)
      .then((success) => {
        alert('successfully');
        this.isGoogleLogin = true;
        this.user =  success.user;
        this.loading.dismiss();
      });

  }
  onLoginError(err) {
    console.log(err);
  }
  logout() {
    this.fireAuth.signOut().then(() => {
      this.isGoogleLogin = false;
    });
  }
}
