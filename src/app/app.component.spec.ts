import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TestBed, async, fakeAsync, tick } from '@angular/core/testing';
import { LoadingController, Platform } from '@ionic/angular';
import { Deploy } from 'cordova-plugin-ionic/dist/ngx';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';

describe('AppComponent', () => {
  let statusBarSpy,
    splashScreenSpy,
    platformReadySpy,
    platformSpy,
    deploySpy,
    loadingControllerSpy,
    presentSpy;

  beforeEach(async(() => {
    statusBarSpy = jasmine.createSpyObj('StatusBar', ['styleDefault']);
    splashScreenSpy = jasmine.createSpyObj('SplashScreen', ['hide']);
    platformReadySpy = Promise.resolve();
    platformSpy = jasmine.createSpyObj('Platform', {
      ready: platformReadySpy,
      is: true,
    });
    deploySpy = jasmine.createSpyObj('deploy', {
      checkForUpdate: Promise.resolve({ available: true }),
      downloadUpdate: null,
      extractUpdate: null,
      reloadApp: Promise.resolve(),
    });

    presentSpy = jasmine.createSpyObj('modal', {
      present: Promise.resolve(),
      dismiss: null,
      message: '',
    });

    loadingControllerSpy = jasmine.createSpyObj('loadingCtrl', {
      create: Promise.resolve(presentSpy),
    });

    TestBed.configureTestingModule({
      declarations: [AppComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        { provide: StatusBar, useValue: statusBarSpy },
        { provide: SplashScreen, useValue: splashScreenSpy },
        { provide: Platform, useValue: platformSpy },
        { provide: Deploy, useValue: deploySpy },
        { provide: LoadingController, useValue: loadingControllerSpy },
      ],
    }).compileComponents();
  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should initialize the app', fakeAsync(() => {
    TestBed.createComponent(AppComponent);
    tick();
    expect(platformSpy.ready).toHaveBeenCalled();
    expect(statusBarSpy.styleDefault).toHaveBeenCalled();
    expect(splashScreenSpy.hide).toHaveBeenCalled();
    expect(deploySpy.checkForUpdate).toHaveBeenCalled();
    expect(deploySpy.downloadUpdate).toHaveBeenCalled();

    const downloadCallback: any = deploySpy.downloadUpdate.calls.mostRecent()
      .args[0];
    downloadCallback(10);
    expect(presentSpy.message).toBe('Downloading 10%');

    const extractCallback: any = deploySpy.extractUpdate.calls.mostRecent()
      .args[0];
    extractCallback(50);
    expect(presentSpy.message).toBe('Installing 50%');
  }));

  it('should not update the app when its not available', fakeAsync(() => {
    deploySpy.checkForUpdate.and.returnValue(
      Promise.resolve({ available: false })
    );
    TestBed.createComponent(AppComponent);
    tick();
    expect(deploySpy.checkForUpdate).toHaveBeenCalled();
    expect(deploySpy.downloadUpdate).not.toHaveBeenCalled();
  }));
});
