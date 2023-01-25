import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IonicModule } from '@ionic/angular';

import { AthentificationPageRoutingModule } from './athentification-routing.module';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AthentificationPage } from './athentification.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    AthentificationPageRoutingModule
  ],
  declarations: [AthentificationPage]
})
export class AthentificationPageModule {}
