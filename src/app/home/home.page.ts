import { Component } from '@angular/core';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import { Plugins,FilesystemDirectory } from '@capacitor/core';
import { Platform } from '@ionic/angular';
import { HttpClient, HttpEventType, HttpHeaders } from '@angular/common/http';
const { Browser,Filesystem } = Plugins;
// import { FileSaver } from 'file-saver';

declare var require: any
const FileSaver = require('file-saver');

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  // filePath:string = "http://www.africau.edu/images/default/sample.pdf";

  filePath:string = 'https://file-examples-com.github.io/uploads/2017/10/file-example_PDF_1MB.pdf';
  downloadProgress = 0;

  constructor(
   private fileOpener: FileOpener,
   private plt:Platform ,
   private http:HttpClient
  ) {}


  // directly open in user default apps/browser
  open(filepath,mimeType){
    if(this.plt.is('desktop') || this.plt.is('mobileweb')){
      Browser.open({ url: filepath});
      console.log("working");
    }else{
      this.fileOpener.open(filepath,mimeType)
      .then(() => console.log('File is opened'))
      .catch(e => console.log('Error opening file', e));
    }

  }
  

  // give user a choice to open his 
  // preferable apps for opening this
  // file 
  dialogOpen(filePath,mimeType){
  if(this.plt.is('desktop') || this.plt.is('mobileweb')){
      Browser.open({ url: filePath});
    }else{
  this.fileOpener.showOpenWithDialog(filePath,mimeType)
  .then(() => console.log('File is opened'))
  .catch(e => console.log('Error opening file', e));
  }
  }

  // if we want to store file using
  // capacitor we need to covert it in
  // base64 before
  // annoymous function
  // **Note: if the files size bigger use another capacitor plugin 'https://www.npmjs.com/package/capacitor-blob-writer'


  convertBlobToBase64(blob:Blob,webFlag=false){
    return new Promise((resolve,reject)=>{
      console.log("blob parameter:",blob);
      // use js FileReader class/object
      // asynchronously
      // more info:'https://developer.mozilla.org/en-US/docs/Web/API/FileReader'

      const reader = new FileReader;
      reader.onerror = (err)=>{
       console.log(err);
       return reject(err);
      };
      reader.onload = () =>{
        console.log(reader.result);
        resolve(reader.result);
       // if(webFlag)window.open(url,'_blank', '');
      }
      reader.readAsDataURL(blob);
    })
  }


  // type checking
  getType(name){
    if(name.indexOf('pdf') >= 0){
      return 'application/pdf';
    }else if(name.indexOf('csv') >= 0){
      return 'text/csv';
   }
  }

  downloadFile(){ 

    this.http.get(this.filePath,{
      // headers:headers,
      responseType:'blob',
      reportProgress:true,
      observe:'events'
    }).subscribe(async event =>{
     //console.log("the event we get:",event); 
     if(event.type === HttpEventType.DownloadProgress){
     this.downloadProgress = Math.round((100 * event.loaded)/event.total);
     }else{
       console.log("the event we get:",event);
       this.downloadProgress = 0;
 
      // find out the last string from path
      // with file extension
      // 'http://www.africau.edu/images/default/sample.pdf' grab the sample.pdf
       const name = this.filePath.substr(this.filePath.lastIndexOf('/') + 1);

      /**
       * Now we have event.body & event.blob
       * 
       * The Filesystem API doesn't have a web implementation because you can't access the filesystem in browsers for security reasons. Accessing the filesystem is only possible for native devices i.e Android and iOS and Electron. So yes; you need to add an Android/iOS target and build a native application if you want to access the Filesystem.
   
       * platform check before save this file
       * 
       */

      if((this.plt.is('desktop') || this.plt.is('mobileweb')) && (event['type']!=0 && event['status'] == 200 && event['body'])){
        console.log("function called");
        this.downloadFileWeb(event,name);
      }
      else if((!this.plt.is('desktop') || !this.plt.is('mobileweb')) && (event['type']!=0 && event['status'] == 200 && event['body'])){
       // get base64 string
       const base64:any = await this.convertBlobToBase64(event['body']);
       console.log("file name:",name,"base64:",base64);
    
       // saved file in to document directory
       // FilesystemDirectory.Documents both android & ios
       // saved in document directory

      /**
     * The external storage directory
     * On iOS it will use the Documents directory
     * On Android it's the primary shared/external storage directory.
     * It's not accesible on Android 10 unless the app enables legacy External Storage
     * by adding `android:requestLegacyExternalStorage="true"` in the `application` tag
     * in the `AndroidManifest.xml`
     */
       const savedResult = await Filesystem.writeFile({
         path:name,
         data:base64,
         directory:FilesystemDirectory.ExternalStorage
       })

      console.log("saved :",savedResult);

      // get the uri and open the file in device
      const path = savedResult.uri;
      const mimeType = this.getType(name);
      console.log("saved uri:",savedResult.uri);
      // open in default file reader apps
      this.open(path,mimeType);
      // Storage set for imediate query
      // Storage.set({
      // })
      }else{
        console.log("still response pending...")
      }
     }
    },
    (err)=>{console.log("On download err: ",err)},
    ()=>{console.log("this subscriber completey end")}
    )

  }


  downloadFileWeb(event,name) {
    // get the mimeType
    const mimeType = this.getType(name);
    let blob:any = new Blob([event['body']], { type: mimeType });
    // open in another web tab with blob data
     const url= window.URL.createObjectURL(blob);
    // const popUp = window.open(url,'_blank', '');
    // if (popUp == null || typeof(popUp)=='undefined') { 	
	  //   alert('Please disable your pop-up blocker and click the "Open" link again.'); 
    // } 
    // else { 	
    //   popUp.focus();
    // }
    // open new browser using capacitor browser
    // plugin
    // this.open(url,mimeType);

    // this package provide save as option
    // **Not successfully working
    // FileSaver.saveAs(blob, name);

    // append a <a> tag for download
    var a = window.document.createElement("a");
    a.href = window.URL.createObjectURL(blob);
    a.target="_blank";
    a.rel="noopener noreferrer";
    a.download = name;
    document.body.appendChild(a);
    // start download
    a.click();
    document.body.removeChild(a);

    console.log(a);
  }
}
