import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { DeviceDetectorService } from 'ngx-device-detector';
import { AuthGoogleService } from 'src/app/Services/auth-google.service';
import { ITypeDevice } from 'src/app/interfaces/ITypeDevice';
import { EventMediatorService } from 'src/app/modules/manager/services/event-mediator.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-menu-manager',
  templateUrl: './menu-manager.component.html',
  styleUrls: ['./menu-manager.component.scss']
})
export class MenuManagerComponent implements OnInit {
  private authGoogleService = inject(AuthGoogleService);
  private router = inject(Router);  
  private eventMediator = inject(EventMediatorService);
  private deviceService = inject(DeviceDetectorService);


  pathImgAvatar = '';
  nombreUsuario = '';
  icono = '';

  objDevice: ITypeDevice = {
    isMobile: false,
    isTablet: false,
    isDesktop: false
  };

constructor(){
  this.objDevice.isMobile = this.deviceService.isMobile();
  this.objDevice.isTablet = this.deviceService.isTablet();
  this.objDevice.isDesktop = this.deviceService.isDesktop();
}

  ngOnInit(): void {
    const objLogin = JSON.parse(localStorage.getItem('laboral.ai')!);
    this.nombreUsuario = objLogin.user.user_name;
    this.icono = objLogin.user.icono || '';        
    // this.pathImgAvatar = environment.epImagesPublic + '/' + this.icono;

    this.pathImgAvatar =
      objLogin.tipo == 'sistema'
        ? environment.epImagesPublic + '/' + this.icono
        : this.icono;

    this.eventMediator
    .avatarChanged
    .subscribe((avatarData) => {
      if(avatarData){
        if(avatarData.icono != ''){
          this.icono = avatarData.icono;        
          this.pathImgAvatar = environment.epImagesPublic + '/' + avatarData.icono;
        }                
        this.nombreUsuario = avatarData.nombreUsuario;
      }
    });
  }

  logout() {
    this.authGoogleService.logout();
    this.router.navigate(['/home']);
    localStorage.clear();
  }



}
