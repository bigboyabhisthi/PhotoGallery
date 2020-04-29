import { Injectable } from '@angular/core';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { Storage } from '@ionic/storage';

const PHOTOS_KEY = 'photos';

@Injectable({
  providedIn: 'root',
})
export class PhotoService {
  public photos: Photo[] = [];

  constructor(private camera: Camera, private storage: Storage) {}

  takePicture() {
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      correctOrientation: true,
    };
    this.camera.getPicture(options).then(
      (imageData) => {
        this.photos.unshift({ data: 'data:image/jpeg;base64,' + imageData });
        // Save all photos for later viewing
        this.storage.set(PHOTOS_KEY, this.photos);
      },
      (error) => {
        console.log('Camera error:', error);
      }
    );
  }

  loadPhotos() {
    this.storage.get(PHOTOS_KEY).then((photos) => {
      this.photos = photos || [];
    });
  }
}

class Photo {
  data: any;
}
