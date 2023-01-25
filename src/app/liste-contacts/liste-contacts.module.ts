import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ListeContactsPageRoutingModule } from './liste-contacts-routing.module';

import { ListeContactsPage } from './liste-contacts.page';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import {UniqueFilterPipe} from '../pipes/uniqueFilter.pipe';
import {FilterPipe} from '../pipes/filter.pipe';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ListeContactsPageRoutingModule,
    Ng2SearchPipeModule
  ],
  declarations: [ListeContactsPage, FilterPipe, UniqueFilterPipe]
})
export class ListeContactsPageModule {}
