import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ModifierContactPage } from './modifier-contact.page';

const routes: Routes = [
  {
    path: '',
    component: ModifierContactPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ModifierContactPageRoutingModule {}
