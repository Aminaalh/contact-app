import { Component, OnInit } from '@angular/core';

import {ReactiveFormsModule, Validators, FormBuilder, FormGroup } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { Compte } from '../models/compte';

import { ContactAccessService } from '../services/contact-acess.service';
import { ContactAuthService } from '../services/contact-auth.service';

import {SQLite, SQLiteObject} from '@ionic-native/sqlite/ngx';

@Component({
  selector: 'app-inscription',
  templateUrl: './inscription.page.html',
  styleUrls: ['./inscription.page.scss'],
})
export class InscriptionPage implements OnInit {

  protected inscriptionForm:  FormGroup;
  private compte: Compte;
  private db: SQLiteObject;

  constructor(
    private firestore: ContactAccessService, 
    private fireauth: ContactAuthService, 
    private formBuilder: FormBuilder,
    private navCtrl: NavController,
    private sqlite: SQLite) {
      this.inscriptionForm = this.formBuilder.group ({
        email:[''],
        password: [''],
        tel: [''],
        nom: [''],
        prenom: ['']
        })
        try{
        this.sqlite.create({
          name: 'data.db',
          location: 'default'}).then((db: SQLiteObject) => {
          this.db = db;
          this.db.executeSql('create table contact(nom VARCHAR(32), prenom VARCHAR(32),tel VARCHAR(32) primary key, '+
          'email VARCHAR(32), adresse VARCHAR(32), ville VARCHAR(32), service VARCHAR(32))', [])
          .then(() => console.log('Executed SQL'))
          .catch(e => console.log(e));
          })
          .catch(e => console.log(e));
        }catch(e){
          console.log(e)
        }
     }

  ngOnInit() {
  }

  signUp(){ 
  this.fireauth.signUp(this.inscriptionForm.value)
  .then(res => { 
    console.log(res);
    this.firestore.newCompte((this.inscriptionForm.value))
    this.navCtrl.navigateForward ('/athentification');
  }, err => {
    console.log(err);
  })
}


}
