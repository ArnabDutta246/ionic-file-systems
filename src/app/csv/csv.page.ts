import { Component, OnInit } from '@angular/core';
import { DemoObject } from './demoObject';
import * as papa from 'papaparse';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import { Plugins,FilesystemDirectory } from '@capacitor/core';
import { Platform } from '@ionic/angular';
import { HttpClient, HttpEventType, HttpHeaders } from '@angular/common/http';
const { Browser, Filesystem } = Plugins;
// import { File } from '@ionic-native/file/ngx';
// import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer/ngx';
@Component({
  selector: 'app-csv',
  templateUrl: './csv.page.html',
  styleUrls: ['./csv.page.scss'],
})
export class CsvPage implements OnInit {
  demoObject = DemoObject;
  parsedData = [];
  plugin = 'capacitor';
  cngPlug = true;
  // private fileTransfer:FileTransferObject = this.transfer.create();
  constructor(
    private fileOpener: FileOpener,
    private plt: Platform,
    private http: HttpClient,
    // private file: File,
    // private transfer:FileTransfer
  ) { 
    
  }
 
  ngOnInit() {
    // this.convertObjectToCsv(this.demoObject);
  }


  convertObjectToCsv(data = null, columnDelimiter = ",", lineDelimiter = "\n") {
    let result, ctr, keys;

    if (data === null || !data.length) {
      return null
    }
    /**
     * For Csv we need header row 
     * And all the keys of any object 
     * are consider as headers
     */
    keys = Object.keys(data[0]);
    // now we generate the csv header string
    result = "";
    result += keys.join(columnDelimiter);
    result += lineDelimiter;
    /**
     * now we using forEach() 
     * we extract every single objects value in a row string
     * saperated by (,)  
     * */

    data.forEach(item => {
      ctr = 0;
      keys.forEach(key => {
        if (ctr > 0) {
          result += columnDelimiter;
        }

        result += typeof item[key] === "string" && item[key].includes(columnDelimiter) ? `"${item[key]}"` : item[key];
        ctr++;
      })
      result += lineDelimiter;
    })
    this.parsedData = papa.parse(result).data;
    console.log("This csv data we build :", this.parsedData);
    console.log("the header row of csv", this.parsedData[0]);
    // call the download function
    this.downloadCsv(this.parsedData);
  }


  // type checking
  getType(name) {
    if (name.indexOf('pdf') >= 0) {
      return 'application/pdf';
    } else if (name.indexOf('csv') >= 0) {
      return 'text/csv';
    }
  }


  // directly open in user default apps/browser
  open(filepath, mimeType) {
    if (this.plt.is('desktop') || this.plt.is('mobileweb')) {
      Browser.open({ url: filepath });
      console.log("working");
    } else {
      this.fileOpener.open(filepath, mimeType)
        .then(() => console.log('File is opened'))
        .catch(e => console.log('Error opening file', e));
    }

  }


  // give user a choice to open his 
  // preferable apps for opening this
  // file 
  dialogOpen(filePath, mimeType) {
    if (this.plt.is('desktop') || this.plt.is('mobileweb')) {
      Browser.open({ url: filePath });
    } else {
      this.fileOpener.showOpenWithDialog(filePath, mimeType)
        .then(() => console.log('File is opened'))
        .catch(e => console.log('Error opening file', e));
    }
  }

  // if we want to store file using
  // capacitor we need to covert it in
  // base64 before
  // annoymous function
  // **Note: if the files size bigger use another capacitor plugin 'https://www.npmjs.com/package/capacitor-blob-writer'
  convertBlobToBase64(blob: Blob, webFlag = false) {
    return new Promise((resolve, reject) => {
      console.log("blob parameter:", blob);
      // use js FileReader class/object
      // asynchronously
      // more info:'https://developer.mozilla.org/en-US/docs/Web/API/FileReader'

      const reader = new FileReader;
      reader.onerror = (err) => {
        console.log(err);
        return reject(err);
      };
      reader.onload = () => {
        console.log(reader.result);
        resolve(reader.result);
        // if(webFlag)window.open(url,'_blank', '');
      }
      reader.readAsDataURL(blob);
    })
  }

  downloadCsv(csv) {
    var blob = new Blob([csv]);
    if (this.plt.is('desktop') || this.plt.is('mobileweb')) {
      console.log("if is calling:func=>downloadCsv");
      this.downloadCsvInDesktop(blob)
    }
    else {
      console.log("else is calling:func=>downloadCsv",this.cngPlug);
      this.downloadCsvInPhone(blob);
      // if (this.cngPlug) { 
      //   this.downloadCsvInPhone(blob);
      // } else {
      //  // this.downloadFileUsingFilePlugin(blob);
      //  this.downloadCsvInPhone(blob);
      // }
    }
  }

  downloadCsvInDesktop(csv, name = "newdata.csv") {
    // Dummy implementation for Desktop download purpose
    //var blob = new Blob([csv]);
    var a = window.document.createElement("a");
    a.href = window.URL.createObjectURL(csv);
    a.download = name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }



  async downloadCsvInPhone(csv, name = "Download/newdata.csv") {
    console.log("Capacitor is calling:func=>downloadCsvInPhone");
    // get base64 string
    const base64: any = await this.convertBlobToBase64(csv);
    console.log("file name:", name, "base64:", base64);

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
      path: name,
      data: base64,
      directory: FilesystemDirectory.ExternalStorage
    })

    console.log("saved :", savedResult);

    // get the uri and open the file in device
    const path = savedResult.uri;
    console.log("path we get return", savedResult.uri)
    const mimeType = this.getType(name);

    // open in default file reader apps
    this.open(path, mimeType);
  }


  // async downloadFileUsingFilePlugin(csv, name = "newdata.csv") {

  //   console.log("Cordova is calling:func=>downloadFileUsingFilePlugin");
  //   // get base64 string
  //   const base64: any = await this.convertBlobToBase64(csv);
  //   console.log("file name:", name, "base64:", base64);

  //   this.file.writeFile(this.file.externalRootDirectory + '/Download/', name, base64,{
  //         replace: true,
  //       }).then((res) => {
  //     console.log("file saved",res);

  //     // get the uri and open the file in device
  //     const path = this.file.externalRootDirectory + '/Download/' + name;
  //     const mimeType = this.getType(name);

  //     // open in default file reader apps
  //     this.open(path, mimeType);

  //   }).catch(err => {
  //     console.log("file saving error", err);
  //   });
  // }


  changePlugin() {
    this.cngPlug = !this.cngPlug;
    this.plugin = this.cngPlug ? 'capacitor' : 'cordova';
    console.log("plugin:",this.plugin,"plugin status:",this.cngPlug)
  }
}
