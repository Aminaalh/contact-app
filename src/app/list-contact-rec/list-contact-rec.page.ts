import { Component, OnInit } from '@angular/core';
import { Contact } from '../models/Contact';
import { Observable } from 'rxjs';
import { ContactAccessService } from '../services/contact-acess.service';
import { NavigationExtras } from '@angular/router';
import { MenuController, NavController } from '@ionic/angular';
import { ContactAuthService } from '../services/contact-auth.service';
@Component({
  selector: 'app-list-contact-rec',
  templateUrl: './list-contact-rec.page.html',
  styleUrls: ['./list-contact-rec.page.scss'],
})
export class ListContactRecPage implements OnInit {

  contacts: Contact[];
  compte: any={};
  email: string;
  searchTerm: string;
  contact: Contact;
  likes: string;
  dislikes: string;

  constructor(private contactService: ContactAccessService,
    private menuCtrl: MenuController,
    public navCtrl: NavController,
    private fireauth: ContactAuthService,
    private firestore: ContactAccessService
    ) {
      this.menuCtrl.enable(true);
    
   }
  detailsContact(email){
    let navigationExtras: NavigationExtras = {
      queryParams: {
        emailContact: email,
        from:"list-contacts-rec"
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
      this.contactService.getAllContact().subscribe( data => {
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
}

}
