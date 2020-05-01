import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { Camera } from '@ionic-native/camera/ngx';
import { Storage } from '@ionic/storage';
import { GalleryPage } from './gallery.page';

describe('GalleryPage', () => {
  let component: GalleryPage;
  let fixture: ComponentFixture<GalleryPage>;
  let cameraSpy, storageSpy;

  beforeEach(async(() => {
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
      declarations: [GalleryPage],
      imports: [IonicModule.forRoot()],
      providers: [
        { provide: Camera, useValue: cameraSpy },
        { provide: Storage, useValue: storageSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(GalleryPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
