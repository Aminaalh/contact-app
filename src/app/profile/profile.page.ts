import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Compte } from '../models/Compte';
import { ContactAccessService } from '../services/contact-acess.service';
import { ContactAuthService } from '../services/contact-auth.service';

//picture

import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/compat/storage';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { finalize, tap } from 'rxjs/operators';

export interface MyData {
  name: string;
  filepath: string;
  size: number;
}

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  image: string;
  compte: any={}; //car on recupere sous format objet not en format Compte
  email: string;

  //picture
  task: AngularFireUploadTask;

  // Progress in percentage
  percentage: Observable<number>;

  // Snapshot of uploading file
  snapshot: Observable<any>;

  // Uploaded File URL
  UploadedFileURL: Observable<string>;

  //Uploaded Image List
  images: Observable<MyData[]>;

  //File details  
  fileName:string;
  fileSize:number;

  //Status check 
  isUploading:boolean;
  isUploaded:boolean;

  private imageCollection: AngularFirestoreCollection<MyData>;
 
  constructor(private contactService: ContactAccessService,
    private fireauth: ContactAuthService,
    private navCtrl : NavController,
    private storage: AngularFireStorage, 
    private database: AngularFirestore
    ) {
      this.isUploading = false;
      this.isUploaded = false;
      //Set collection where our documents/ images info will save
      this.imageCollection = database.collection<MyData>('freakyImages');
      this.images = this.imageCollection.valueChanges();
   }

  ngOnInit() {
   
    this.fireauth.userDetails().subscribe(res => {
      if (res !== null){
        this.email = res.email;
        this.contactService.getCompte(this.email).subscribe( res => {
          this.compte=<Compte>res;
       })
       
      } else {
        this.navCtrl.navigateForward('/authentification');
      }
    }, err => {
      console.log('erreur = ', err);
    }) 
  }

   //picture
  uploadFile(event: FileList) {
    // The File object
    const file = event.item(0)

    // Validation for Images Only
    if (file.type.split('/')[0] !== 'image') { 
     console.error('unsupported file type :( ')
     return;
    }

    this.isUploading = true;
    this.isUploaded = false;


    this.fileName = file.name;

    // The storage path
    const path = `freakyStorage/${new Date().getTime()}_${file.name}`;

    // Totally optional metadata
    const customMetadata = { app: 'Freaky Image Upload Demo' };

    //File reference
    const fileRef = this.storage.ref(path);

    // The main task
    this.task = this.storage.upload(path, file, { customMetadata });

    // Get file progress percentage
    this.percentage = this.task.percentageChanges();
    this.snapshot = this.task.snapshotChanges().pipe(
      
      finalize(() => {
        // Get uploaded file storage path
        this.UploadedFileURL = fileRef.getDownloadURL();
        
        this.UploadedFileURL.subscribe(resp=>{
          this.addImagetoDB({
            name: file.name,
            filepath: resp,
            size: this.fileSize
            
          });
          this.isUploading = false;
          this.isUploaded = true;
        },error=>{
          console.error(error);
        })
      }),
      tap(snap => {
          this.fileSize = snap.totalBytes;
      })
    )
  }

  addImagetoDB(image: MyData) {
    //Create an ID for document
    const id = this.database.createId();

    //Set document id with value in database
    this.imageCollection.doc(id).set(image).then(resp => {
      console.log(resp);
      let mail;
      this.fireauth.userDetails().subscribe(resp => {
        if (resp !== null) {
          mail= resp.email;
          this.compte.image = image.filepath;
          this.contactService.addImageURL(mail,  this.compte)
        } else {
          this.navCtrl.navigateForward('/liste-contacts');
        }
      }, err => {
      console.log('err', err);
      })

    }).catch(error => {
      console.log("error " + error);
    });
  }
}
