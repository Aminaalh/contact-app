import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { Contact } from '../models/Contact';
import { ContactAccessService } from '../services/contact-acess.service';
import { ContactAuthService } from '../services/contact-auth.service';
import { CallNumber } from '@ionic-native/call-number/ngx';
import { EmailComposer } from '@ionic-native/email-composer/ngx';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { SMS } from '@ionic-native/sms/ngx';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import {SQLite, SQLiteObject} from '@ionic-native/sqlite/ngx';


@Component({
  selector: 'app-detail-contact',
  templateUrl: './detail-contact.page.html',
  styleUrls: ['./detail-contact.page.scss'],
})
export class DetailContactPage implements OnInit {

  emailContact:string;
  from:string;
  contact: any;
  protected isButtonsVisible=false;
  db: SQLiteObject;
  star_icon_type: string="star-outline";
 // star_icon_type
  
  constructor(
    private contactservice:ContactAccessService,
    private fireauth :ContactAuthService,
    private firestore: ContactAccessService,
    private navCtrl: NavController,
    private route: ActivatedRoute,
    private router: Router,
    private callNumber: CallNumber,
    private emailComposer: EmailComposer,
    private geolocation: Geolocation,
    private sms: SMS,
    private socialSharing:SocialSharing,
    private sqlite: SQLite,
    ) {
        
        this.route.queryParams.subscribe(params => {
            this.emailContact = params["emailContact"];
            this.from=params["from"];
            if (this.from==="liste-contacts-rec"){
              this.isButtonsVisible = false;
            }
              
            else if(this.from==="liste-contacts"){
              this.isButtonsVisible = true;
            }
              
            else if(this.from==="favoris"){
              this.isButtonsVisible = true;
            }               
        });

  }

  Email(){
    let email = {to: this.contact.email, subject: '[Rediger votre objet]', body: '[Rediger votre message]',
    isHtml: true
    }
    this.emailComposer.open(email);
  }

  SMS(){
    this.sms.send(this.contact.tel, '[Votre message ici!!!]');
  }

  GPS(): string{
    this.geolocation.getCurrentPosition().then((resp) => {
    return  "("+resp.coords.latitude+","+resp.coords.longitude+")"
    }).catch((error) => {
    console.log('Error getting location', error);
    return " ";
    });
    return "";
  }

  //testée
  Appel(){
    this.callNumber.callNumber(this.contact.tel, true).then(res => console.log('Launched dialer!', res)).catch(err => console.log('Error launching dialer', err));
  }

  personel(){
        this.fireauth.userDetails().subscribe(res => {
          console.log('res', res);
          if (res !== null) {
            this.contactservice.getPersonalContact(res.email,this.emailContact).subscribe(res => {
            this.contact=<Contact>res;
            this.sqlite.create({
              name: 'data.db',
              location: 'default'
            })
            .then((db: SQLiteObject) => {
               this.db = db;
               this.db.executeSql('select * from contact where tel="'+this.contact.tel+'"', [])
                .then((data) => {if (data.rows.length>0) this.star_icon_type="star"; else this.star_icon_type = "star-outline"; })
                .catch(e => console.log(e));
              }).catch(e => console.log("hiiiiiiiiiii", e));
                console.log(res); 
            })
           } else {
               this.navCtrl.navigateForward('/authentification');
           }
          }, err => {
              console.log('err', err);
        })  
  }

  //testée
  Sharing(){
    this.socialSharing.shareViaWhatsAppToPhone(this.contact.tel,
    this.GPS(),null).then(() => {
    // Success!
    this.GPS()
    }).catch(() => {
    // Error!
    });
  }
  
  recommande(){
      this.fireauth.userDetails().subscribe(res => {
        console.log('res', res);
        if (res !== null) {
          this.contactservice.getContact(this.emailContact).subscribe
          (res => {
          this.contact=<Contact>res ;
          this.sqlite.create({
            name: 'data.db',
            location: 'default'
          })
          .then((db: SQLiteObject) => {
             this.db = db;
             this.db.executeSql('select * from contact where tel="'+this.contact.tel+'"', [])
              .then((data) => {if (data.rows.length>0) this.star_icon_type="star"; else this.star_icon_type = "star-outline"; })
              .catch(e => console.log(e));
            }).catch(e => console.log(e));
              console.log(res); 
        
          })
        } else {
          this.navCtrl.navigateForward('/athentification');
        }
      }, err => {
      console.log('err', err);
      })
  }

  Partager(){
      this.fireauth.userDetails().subscribe(res => {
      console.log('res', res);
      if (res !== null) {
      this.firestore.newContact(this.contact)
      this.navCtrl.navigateForward('/list-contact-rec');
      } else {
      this.navCtrl.navigateForward('/athentification');
      }
      }, err => {
      console.log('err', err);
      })
  }

  Modifier(email, nom, prenom,tel,ville,adresse,service){
    let navigationExtras: NavigationExtras = {
      queryParams: {
        emailContact: email,
        nomContact: nom,
        prenomContact: prenom,
        telContact: tel,
        villeContact: ville,
        adresseContact: adresse,
        serviceContact: service,
        from:"detail-contact"
      }
    };
    this.navCtrl.navigateForward('/modifier-contact', navigationExtras);

  }

  Supprimer(){
        this.fireauth.userDetails().subscribe(res => {
        console.log('res', res);
        if (res !== null) {
        this.contactservice.deleteContactPersonel(res.email,this.contact.email);
        this.navCtrl.navigateForward('/liste-contacts');
        } else {
        this.navCtrl.navigateForward('/authentification');
        }
        }, err => {
        console.log('err', err);
        })
  }

  /////////////////////////
  ajouterFavori(){
    if (this.star_icon_type=="star"){
      this.star_icon_type="star—outline"
      this.sqlite.create({
       name: 'data.db',
       location: 'default'
      }).then((db: SQLiteObject) => {
        db.executeSql('delete from contact where tel="'+this.contact.tel+'"', [])
        .then(() => console.log('Executed SQL delete'))
        .catch(e => console.log(e));        
      }).catch(e => console.log(e));
    }    
    else{
      this.star_icon_type="star" 
      this.sqlite.create({
       name: 'data.db',
       location: 'default'
      }).then((db: SQLiteObject) => {
         this.db.executeSql('insert into contact(nom, prenom, tel, email, adresse, ville, service) values("' 
         +this.contact.nom+'","'+this.contact.prenom+'","'+
         this.contact.tel+'","'+ 
         this.contact.email+'","'+ 
         this.contact.adresse+'","'+ 
         this.contact.ville+'","'+ 
         this.contact.service+'")', [])
           .then(() => console.log('Executed SQL insert'))
           .catch(e => console.log(e));
       }).catch(e => console.log(e));
      }
   }
  
  ////////////////////////

  ngOnInit() {
        if (this.from==="liste-contacts-rec")
            this.recommande();
        else if(this.from==="liste-contacts")
            this.personel();
        else if(this.from==="favoris")  
            this.favori(); 
  }

  favori(){
    this.sqlite.create({
      name: 'data.db',
      location: 'default'
    })
    .then((db: SQLiteObject) => {
      this.db = db;
      this.db.executeSql('select * from contact where email="'+this.emailContact+'"', [])
      .then((data) => {this.contact = data.rows.item(0)})
      .catch(e => console.log(e));
    });

    this.star_icon_type="star";
  }
}
