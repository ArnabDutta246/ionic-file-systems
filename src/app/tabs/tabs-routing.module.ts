import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children:[
      {
        path: 'pdf-explore',
        loadChildren: () => import('../home/home.module').then( m => m.HomePageModule)
      },
      {
        path: 'csv-explore',
        loadChildren: () => import('../csv/csv.module').then( m => m.CsvPageModule)
      },
      {
        path:'',
        redirectTo:'pdf-explore',
        pathMatch:'full'
      }
    ]
  },
  {
    path:'',
    redirectTo:'pdf-explore',
    pathMatch:'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabsPageRoutingModule {}
