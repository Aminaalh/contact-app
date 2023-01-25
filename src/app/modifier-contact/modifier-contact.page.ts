import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { MenuController, NavController } from '@ionic/angular';
import { Contact } from '../models/Contact';
import { ContactAccessService } from '../services/contact-acess.service';
import { ContactAuthService } from '../services/contact-auth.service';
@Component({
  selector: 'app-modifier-contact',
  templateUrl: './modifier-contact.page.html',
  styleUrls: ['./modifier-contact.page.scss'],
})
export class ModifierContactPage implements OnInit {
  public modifierContactForm: FormGroup;
  emailContact:string;
  nomContact:string;
  prenomContact:string;
  telContact:string;
  villeContact:string;
  adresseContact:string;
  serviceContact:string;
  from:string;
  contact = {
    prenom : '',
    nom : '',
    email : '',
    tel : '',
    ville : '',
    adresse : '',
    service : ''
  }

  constructor(
    private contactservice:ContactAccessService,
    private fireauth :ContactAuthService,
    private firestore: ContactAccessService,
    private navCtrl: NavController,
    private menuCtrl: MenuController,
    private route: ActivatedRoute,
    private router: Router,
    formBuilder: FormBuilder,
  ) { 
    this.route.queryParams.subscribe(params => {
      this.contact.email = params["emailContact"];
      this.contact.nom = params["nomContact"];
      this.contact.prenom= params["prenomContact"];
      this.contact.tel = params["telContact"];
      this.contact.ville = params["villeContact"];
      this.contact.adresse = params["adresseContact"];
      this.contact.service= params["serviceContact"];
      this.from=params["from"];
      
        
          });
  this.menuCtrl.enable(true);
    
  }

  modifierContact(email, nom,prenom,tel,ville,adresse,service){
    this.fireauth.userDetails().subscribe(res => {
    console.log('res', res);
    if (res !== null) {
    this.firestore.newLikes1(res.email, this.contact.email,{
      prenom : this.contact.prenom,
      nom : this.contact.nom,
      email :this.contact.email,
      tel :this.contact.tel,
      ville : this.contact.ville,
      adresse :this.contact.adresse,
      service : this.contact.service
    })
    console.log('res', this.contact);
    this.navCtrl.navigateForward('/liste-contacts');
    } else {
    this.navCtrl.navigateForward('/authentification');
    }
    }, err => {
    console.log('err', err);
    })
    }

   

  ngOnInit() {


  }

}
