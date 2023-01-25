import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ModifierContactPageRoutingModule } from './modifier-contact-routing.module';

import { ModifierContactPage } from './modifier-contact.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    ModifierContactPageRoutingModule
  ],
  declarations: [ModifierContactPage]
})
export class ModifierContactPageModule {}
