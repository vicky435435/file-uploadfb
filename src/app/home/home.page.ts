import { Component } from '@angular/core';
import{Firestore, addDoc, collection} from '@angular/fire/firestore'
import {Storage, getDownloadURL, ref, uploadBytes } from '@angular/fire/storage';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Capacitor } from '@capacitor/core';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
 image: any;

  constructor( private firestore: Firestore,
    private storage: Storage
  ) {}

 async takePiture() {
    try{
  if(Capacitor.getPlatform() != 'web') await Camera.requestPermissions();
  const image = await Camera.getPhoto({
    quality : 90,
    source: CameraSource.Prompt,
    width: 600,
    resultType: CameraResultType.DataUrl
  });
  console.log('image', image);
  this.image=image.dataUrl;
  const blob = this.dataURLtoBlob(image.dataUrl);
  const url = await this.uploadImage(blob, image);
  console.log(url);
  const response = await this.addDocument('test',{ imageUrl:url });
  console.log(response);
    } catch(e){
    console.log(e)
    }
  }

  dataURLtoBlob(dataurl: any){
    var arr = dataurl.split(','),mime = arr[0].match(/:(.*?);/)[1],
    bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while(n--){
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob ([u8arr], {type:mime});
  }

  async uploadImage(blob: any, imageData:any) {
     try {
    const currentDate = Date.now();
    const filePath = `test/${currentDate}.${imageData.format}`;
    const fileRef = ref(this.storage, filePath);
    const task = await uploadBytes(fileRef, blob);
    console.log('task: ', task);
    const url = getDownloadURL(fileRef);
    return url;
     } catch(e) {
      throw(e)
     }
  }

  addDocument(path :any, data:any){
    const dataRef = collection(this.firestore, path);
    return addDoc(dataRef, data)
  }

}
