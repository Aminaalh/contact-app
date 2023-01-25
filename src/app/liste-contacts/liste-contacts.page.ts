import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { NavController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { Contact } from '../models/Contact';
import { Compte } from '../models/Compte';
import { ContactAccessService } from '../services/contact-acess.service';
import { ContactAuthService } from '../services/contact-auth.service';
import { NavigationExtras } from '@angular/router';


@Component({
  selector: 'app-liste-contacts',
  templateUrl: './liste-contacts.page.html',
  styleUrls: ['./liste-contacts.page.scss'],
})
export class ListeContactsPage implements OnInit {
  contacts: any;
  contact: Contact;
  compte: any={};
  email: string;
  likes: string;
  dislikes: string;
  searchTerm: string;
  filteredLocation = 'All';
  constructor(private contactService: ContactAccessService,
    private menuCtrl: MenuController,
    public navCtrl: NavController,
    private fireauth: ContactAuthService,
    private firestore: ContactAccessService
    ) {
      this.menuCtrl.enable(true);    
   }

  ajouterContact(){
    this.navCtrl.navigateRoot('/ajouter-contact');
    }

  detailsContact(email){
        let navigationExtras: NavigationExtras = {
          queryParams: {
            emailContact: email,
            from:"liste-contacts"
          }
        };
        this.navCtrl.navigateForward('/detail-contact', navigationExtras);
    }

  like(likes, contact){
    let mail;
    this.fireauth.userDetails().subscribe(res => {
      console.log('res', res);
      if (res !== null) {
        mail= res.email;
        console.log(mail);
        console.log(contact);
        contact.likes+= 1;
        this.firestore.newLikes(mail, contact)
        this.firestore.newLikesre(contact.email, contact)        
      } else {
        this.navCtrl.navigateForward('/liste-contacts');
      }
    }, err => {
    console.log('err', err);
    })
    }
    
  dislike(dislikes, contact){
    let mail;
    this.fireauth.userDetails().subscribe(res => {
      console.log('res', res);
      if (res !== null) {
        mail= res.email;
        console.log(mail);
        console.log(contact);
        contact.dislikes+= 1;
        this.firestore.newLikes(mail, contact) 
        this.firestore.newLikesre(contact.email, contact)       
      } else {
        this.navCtrl.navigateForward('/liste-contacts');
      }
    }, err => {
    console.log('err', err);
    })
    
  }

  ngOnInit() {    
    
    this.fireauth.userDetails().subscribe(res => {
      if (res !== null){
        this.email = res.email;
        this.contactService.getAllPersonalContact(res.email).subscribe( data => {
          this.contacts = data.map(e => {
            return {
              adresse: e.payload.doc.data()['adresse'],
              email: e.payload.doc.data()['email'],
              nom: e.payload.doc.data()['nom'],
              prenom: e.payload.doc.data()['prenom'],
              service: e.payload.doc.data()['service'],
              tel: e.payload.doc.data()['tel'],
              ville: e.payload.doc.data()['ville'],
              likes: e.payload.doc.data()['likes'],
              dislikes: e.payload.doc.data()['dislikes'],
            
            };
          })
          console.log(this.contacts);
        });
        
      } else {
        this.navCtrl.navigateForward('/athentification');
      }
    }, err => {
      console.log('erreur = ', err);
    })
  }
}
