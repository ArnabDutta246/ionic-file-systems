import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CsvPageRoutingModule } from './csv-routing.module';

import { CsvPage } from './csv.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CsvPageRoutingModule
  ],
  declarations: [CsvPage]
})
export class CsvPageModule {}
