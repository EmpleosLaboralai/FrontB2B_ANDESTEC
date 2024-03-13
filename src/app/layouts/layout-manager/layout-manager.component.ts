import { Component, inject, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { AuthGoogleService } from 'src/app/Services/auth-google.service';
import { DeviceDetectorService } from 'ngx-device-detector';
import { EventMediatorService } from 'src/app/modules/manager/services/event-mediator.service';
import { ITypeDevice } from 'src/app/interfaces/ITypeDevice';

@Component({
  selector: 'app-layout-manager',
  templateUrl: './layout-manager.component.html',
  styleUrls: ['./layout-manager.component.scss'],
})
export class LayoutManagerComponent {
  private authGoogleService = inject(AuthGoogleService);
  private router = inject(Router);
  private eventMediator = inject(EventMediatorService);

  open = true;
  showSidebar=true;

  public getScreenWidth: any;
  public getScreenHeight: any;
  deviceInfo = '';

constructor(private deviceService: DeviceDetectorService){
  console.log('hello `Home` component');
  const x = this.deviceService.getDeviceInfo();
  const isMobile = this.deviceService.isMobile();
  const isTablet = this.deviceService.isTablet();
  const isDesktopDevice = this.deviceService.isDesktop();
  // console.log(this.deviceInfo);
  console.log(x);
  console.log(isMobile);  // returns if the device is a mobile device (android / iPhone / windows-phone etc)
  console.log(isTablet);  // returns if the device us a tablet (iPad etc)
  console.log(isDesktopDevice); //

  const objDevice: ITypeDevice={
    isMobile: isMobile,
    isTablet: isTablet,
    isDesktop: isDesktopDevice
  }
  this.eventMediator.notifyOnDeviceChanged(objDevice);
}

  logout() {
    this.authGoogleService.logout();
    this.router.navigate(['/home']);
    localStorage.clear();
  }

  toggle() {
    this.open = !this.open;
  }

  @HostListener('window:resize', ['$event'])
  onWindowResize() {
    this.getScreenWidth = window.innerWidth;
    this.getScreenHeight = window.innerHeight;
    if(this.getScreenWidth >= 670 ){
      this.showSidebar = true;
    }else{
      this.showSidebar = false;
    }
  }
}
