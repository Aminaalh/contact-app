import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ListContactRecPageRoutingModule } from './list-contact-rec-routing.module';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { ListContactRecPage } from './list-contact-rec.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ListContactRecPageRoutingModule,
    Ng2SearchPipeModule
  ],
  declarations: [ListContactRecPage]
})
export class ListContactRecPageModule {}
