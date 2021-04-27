import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FileDownloadUploadService {

  constructor() { }

  // type checking
  getType(name){
    if(name.indexOf('pdf') >= 0){
      return 'application/pdf';
    }else if(name.indexOf('csv') >= 0){
      return 'text/csv';
   }
  }

  
}
