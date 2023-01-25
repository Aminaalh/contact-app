import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore'
import { Compte } from '../models/compte';

@Injectable({
  providedIn: 'root' 
})

export class ContactAccessService {


  constructor( private firestore: AngularFirestore) { }

  compteRef:AngularFirestore;

  // Get Compte
  getCompte(id: string) {
    return this.firestore.doc('/Compte/'+id).valueChanges();
  }

  getContact(id: string) {
    return this.firestore.doc('/Contacts/'+id).valueChanges();
  }

  getAllCompte() {
    return this.firestore.collection('/Compte/').snapshotChanges();
  }

  getAllContact() {
    return this.firestore.collection('/Contacts/').snapshotChanges();
  }

  getPersonalContact(id1: string, id2: string){
    return this.firestore.doc('/Compte/'+id1).collection('/Contacts/').doc(id2).valueChanges();
  }

  getAllPersonalContact(id: string){
    return this.firestore.doc('/Compte/'+id).collection('/Contacts').snapshotChanges();
  }

  newCompte(compte: Compte){
    return this.firestore.collection( '/Compte/').doc(compte.email).set(compte) ;
  }

  newContact(contact) {
    return this.firestore.collection('/Contacts/').doc(contact.tel).set(contact) ;
  }

  newPersonalContact(id, contact) {
    return this.firestore.doc( '/Compte/' +id).collection( '/Contacts/').doc(contact.email).set(contact) ;
  }

  newLikes(id, contact){
    return this.firestore.doc('/Compte/'+id).collection('/Contacts/').doc(contact.email).update(contact);
  }

  newLikes1(id1: string, id2: string ,contact){
    return this.firestore.doc('/Compte/'+id1).collection('/Contacts/').doc(id2).update(contact);
  }

  newLikesre(id, contact){
    return this.firestore.doc('/Contacts/'+id).update(contact);
  }

  deleteContactPersonel(id1: string, id2: string ){
    return this.firestore.doc('/Compte/'+id1).collection('/Contacts').doc(id2).delete();
  }

  //picture
  addImageURL(id, compte){
    return this.firestore.doc('/Compte/'+id).update(compte);
  }
  
}
