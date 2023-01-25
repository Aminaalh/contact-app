import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListContactRecPage } from './list-contact-rec.page';

const routes: Routes = [
  {
    path: '',
    component: ListContactRecPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ListContactRecPageRoutingModule {}
