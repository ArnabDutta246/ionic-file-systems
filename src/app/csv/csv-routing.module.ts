import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CsvPage } from './csv.page';

const routes: Routes = [
  {
    path: '',
    component: CsvPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CsvPageRoutingModule {}
