import { Component } from '@angular/core';


export const appPages = [
  {
   title: 'Pdf download',
   url: 'pdf-explore',
   icon: 'document',
   tab: 'pdf-explore',
  },
  {
   title: 'CSV maker',
   url: 'csv-explore',
   icon: 'clipboard',
   tab: 'csv-explore',
  },
] 
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {

  appPages = appPages;
  constructor() {}
}
