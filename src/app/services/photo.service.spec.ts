import { TestBed } from '@angular/core/testing';

import { PhotoService } from './photo.service';
import { Camera } from '@ionic-native/camera/ngx';
import { Storage } from '@ionic/storage';

describe('PhotoService', () => {
  let cameraSpy, storageSpy;

  beforeEach(async () => {
    cameraSpy = jasmine.createSpyObj('Camera', {
      DestinationType: {
        DATA_URL: '',
      },
      EncodingType: {
        JPEG: '',
      },
      MediaType: {
        PICTURE: '',
      },
      getPicture: Promise.resolve(),
    });

    storageSpy = jasmine.createSpyObj('Storage', {
      set: Promise.resolve(),
      get: Promise.resolve(),
    });
    TestBed.configureTestingModule({
      providers: [
        { provide: Camera, useValue: cameraSpy },
        { provide: Storage, useValue: storageSpy },
      ],
    });
  });

  it('should be created', () => {
    const service: PhotoService = TestBed.get(PhotoService);
    expect(service).toBeTruthy();
  });

  it('should be capture the capture the photo', () => {
    const service: PhotoService = TestBed.get(PhotoService);
    spyOn(service, 'takePicture').and.callThrough();
    expect(cameraSpy.getPicture).toHaveBeenCalled();
  });
});
