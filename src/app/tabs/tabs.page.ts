import { Component, OnInit } from '@angular/core';
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
  selector: 'app-tabs',
  templateUrl: './tabs.page.html',
  styleUrls: ['./tabs.page.scss'],
})
export class TabsPage implements OnInit {
  appPages = appPages;
  constructor() { }

  ngOnInit() {
  }

}
