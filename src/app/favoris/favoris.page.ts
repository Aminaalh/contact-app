import { Component, OnInit } from '@angular/core';
import { NavigationExtras } from '@angular/router';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';
import { MenuController, NavController } from '@ionic/angular';
import * as internal from 'stream';
import { Contact } from '../models/Contact';
import { ContactAccessService } from '../services/contact-acess.service';
import { ContactAuthService } from '../services/contact-auth.service';

@Component({
  selector: 'app-favoris',
  templateUrl: './favoris.page.html',
  styleUrls: ['./favoris.page.scss'],
})
export class FavorisPage implements OnInit {
  contacts: Contact[];
  contact: Contact;
  compte: any={};
  email: string;
  likes: string;
  dislikes: string;
  searchTerm: string;
  i: any;
  db: SQLiteObject;
  filteredLocation = 'All';
  constructor(private contactService: ContactAccessService,
    private menuCtrl: MenuController,
    public navCtrl: NavController,
    private fireauth: ContactAuthService,
    private firestore: ContactAccessService,
    private sqlite: SQLite,
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
    this.contacts = [];
    this.fireauth.userDetails().subscribe(res => {
      if (res !== null){
        this.email = res.email;
        this.sqlite.create({
          name: 'data.db',
          location: 'default'
        }).then((db: SQLiteObject) => {
          this.db = db;
          this.db.executeSql('select * from contact', [])
          .then((data) => {
            for(this.i=0;this.i<data.rows.length;this.i++){         
              let item = data.rows.item(this.i);
              this.contacts.push(item);
            }         
          })
          .catch(e => console.log(e));
        });
      } else {
        this.navCtrl.navigateForward('/authentification');
      }
    }, err => {
      console.log('erreur = ', err);
    })
  }
}
