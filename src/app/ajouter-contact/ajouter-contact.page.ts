import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { NavController } from '@ionic/angular';
import { ContactAuthService } from '../services/contact-auth.service';
import { ContactAccessService } from '../services/contact-acess.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
@Component({
  selector: 'app-ajouter-contact',
  templateUrl: './ajouter-contact.page.html',
  styleUrls: ['./ajouter-contact.page.scss'],
})
export class AjouterContactPage implements OnInit {
  protected ajouterContactForm: FormGroup;
  constructor(private menuCtrl: MenuController, public navCtrl: NavController, private fireauth:ContactAuthService, private firestore: ContactAccessService, formBuilder: FormBuilder,) {
    this.menuCtrl.enable(true);
    this.ajouterContactForm = formBuilder.group({
      nom: ['', Validators.required],
      prenom: ['', Validators.required],
      email: ['', Validators.required],
      tel: ['', Validators.required],
      ville: ['', Validators.required],
      adresse: ['', Validators.required],
      service: ['', Validators.required],
      likes: [0],
      dislikes: [0],
    });
   }
   nouveauContact(){
    this.fireauth.userDetails().subscribe(res => {
    console.log('res', res);
    if (res !== null) {
    this.firestore.newPersonalContact(res.email,this.ajouterContactForm.value)
    console.log('res', res);
    this.navCtrl.navigateForward('/liste-contacts');
    } else {
    this.navCtrl.navigateForward('/athentification');
    }
    }, err => {
    console.log('err', err);
    })
    }
  ngOnInit() {
  }

}
