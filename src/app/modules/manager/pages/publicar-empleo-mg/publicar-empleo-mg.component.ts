import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IListaEmpleos } from '../../interfaces/IListaEmpleos';
import { EmpresaService } from '../../services/empresa.service';
import { Subscription } from 'rxjs';
import { EventMediatorService } from '../../services/event-mediator.service';
import { ITypeDevice } from 'src/app/interfaces/ITypeDevice';

declare var $:any;
@Component({
  selector: 'app-publicar-empleo-mg',
  templateUrl: './publicar-empleo-mg.component.html',
  styleUrls: ['./publicar-empleo-mg.component.scss'],
})
export class PublicarEmpleoMgComponent implements OnInit, OnDestroy {
 
  private router = inject(Router);
  private empresaService = inject(EmpresaService);
  private eventMediator = inject(EventMediatorService);

  bol_detalle = false;
  bol_LoadingEmpleos = false;
  empleoDetalle: IListaEmpleos={
    id: 0,
    img: '',
    titulo: '',
    modalidad: '',
    descripcion: '',
    funciones: [],
    conocimientos: [],
    link: ''
  };
  vIdUsuario = 0;
  arrEmpleos: IListaEmpleos[] = [];
  suscriptionListarEmpleos!:Subscription;
  suscriptionVerificar!:Subscription;
  subscriptionDeviceChanged!:Subscription;
  typeDevice: ITypeDevice | null ={
    isMobile: false,
    isTablet: false,
    isDesktop: false
  }; 

  ngOnInit(): void {
    const objLogin = JSON.parse(localStorage.getItem('laboral.ai')!);
    this.vIdUsuario = Number.parseInt(objLogin.user.id);

    this.cargarEmpleos();
    this.verificarDataEmpresa();
    this.verificarTypeDevice();
  }

  ngOnDestroy(): void {
    if(this.suscriptionListarEmpleos)this.suscriptionListarEmpleos.unsubscribe();
    if(this.suscriptionVerificar)this.suscriptionVerificar.unsubscribe();
    if(this.subscriptionDeviceChanged)this.subscriptionDeviceChanged.unsubscribe();
  }

  verificarTypeDevice(){
    
      this.eventMediator.deviceChanged
          .subscribe({
            next: (resp) => {
              console.log(resp);           
              this.typeDevice = resp;   
            },
            error: (err) => {
              console.log(err);
            },
            complete: () => {
              console.log('Complete deviceChanged()');
            },
          });
  }

  verificarDataEmpresa() {
    this.suscriptionVerificar = this.empresaService.listarEmpresaPorUsuario(this.vIdUsuario).subscribe({
      next: (resp) => {
        console.log(resp);
        if(resp.codigoRespuesta == '00' && !resp.hasData){
          $('#modalAvisoFaltaDatos').modal('show')
        }
      },
      error: (err) => {
        console.log(err);
      },
      complete: () => {
        console.log('complete listarEmpresaPorUsuario()');
      },
    });
  }

  cargarEmpleos() {
    this.bol_LoadingEmpleos = true;
    this.suscriptionListarEmpleos = this.empresaService.listarEmpleosPorUsuario(this.vIdUsuario).subscribe({
      next: (resp) => {
        console.log(resp);
        this.bol_LoadingEmpleos = false;
        resp.data.forEach((element) => {
          this.arrEmpleos.push({
            id: element.id_job_description,
            descripcion: element.req_qualifications,
            titulo: element.job_title,
            modalidad: element.modality,
            img: element.company,
            funciones: element.key_responsabilities.split('.'),
            conocimientos: element.techskill_tool.split('.'),
            link:element.job_offer_link
          });
        });
      },
      error: (err) => {
        console.log(err);
        this.bol_LoadingEmpleos = false;
      },
      complete: () => {
        console.log('complete listarEmpleosPorUsuario()');
      },
    });
  }

  irNuevoEmpleo() {
    this.router.navigate(['/manager/publicar-editar']);
  }

  verDetalle(empleo: IListaEmpleos) {
    this.bol_detalle = true;
    this.empleoDetalle = empleo;
     console.log('desde mg empleo ===>', empleo);
     if(this.typeDevice?.isMobile){

      $('#modalVerEmpleo').modal('show')

     }
  }
}
