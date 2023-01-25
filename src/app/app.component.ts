import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Compte } from './models/compte';
import { ContactAccessService } from './services/contact-acess.service';
import { ContactAuthService } from './services/contact-auth.service';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  public appPages = [
    { title: 'Mes Contacts', url: '/liste-contacts', icon: '' },
    { title: 'Recommandations', url: '/list-contact-rec', icon: '' },
    { title: 'Profile', url: '/profile', icon: '' },
    { title: 'Favoris', url: '/favoris', icon: '' },
    { title: 'Déconnexion', url: '/athentification', icon: '' },
    // { title: 'inscription', url: '/inscription', icon: '' }
  ];

  public labels = ['Family', 'Friends', 'Notes', 'Work', 'Travel', 'Reminders'];
  image: string;
  compte: any={}; 
  email: string;
  
  constructor(private contactService: ContactAccessService,
    private fireauth: ContactAuthService,
    private navCtrl : NavController,
    ) {
   }

  ngOnInit() {
   
    this.fireauth.userDetails().subscribe(res => {
      if (res !== null){
        this.email = res.email;
        this.contactService.getCompte(this.email).subscribe( res => {
          this.compte=<Compte>res;
       })
       
      } else {
        this.navCtrl.navigateForward('/athentification');
      }
    }, err => {
      console.log('erreur = ', err);
    }) 
  }
}
