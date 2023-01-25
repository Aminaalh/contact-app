import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { ContactAuthService } from '../services/contact-auth.service';

@Component({
  selector: 'app-deconnexion',
  templateUrl: './deconnexion.page.html',
  styleUrls: ['./deconnexion.page.scss'],
})
export class DeconnexionPage implements OnInit {

  constructor(
    private fireauth: ContactAuthService,
    private navCtrl: NavController,
  ) { }

  ngOnInit() {
  }

  signOut(){
  this.fireauth.singOut ()
  .then(res => {
    console. log ("res") ;
    this.navCtrl.navigateRoot( "/authentification");
    console.log(res) ;
  } ,err => { 
    console. log (err)
  })
  }
}
