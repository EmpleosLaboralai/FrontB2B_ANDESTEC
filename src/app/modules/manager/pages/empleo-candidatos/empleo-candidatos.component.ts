import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { EmpresaService } from '../../services/empresa.service';
import { IReqListarCandiPorEmpleo } from '../../interfaces/IReqListarCandiPorEmpleo';
import { ActivatedRoute, Router } from '@angular/router';
import { IResListarCandiPorEmpleoDet } from '../../interfaces/IResListarCandiPorEmpleo';
import { Subscription } from 'rxjs';
import { EventMediatorService } from '../../services/event-mediator.service';
import { IResListarEmpleosOpenCloseDet } from '../../interfaces/IResListarEmpleosOpenClose';
import { ITypeDevice } from 'src/app/interfaces/ITypeDevice';
import { environment } from 'src/environments/environment';
import { LocalstorageService } from '../../services/localstorage.service';

declare var $: any;

@Component({
  selector: 'app-empleo-candidatos',
  templateUrl: './empleo-candidatos.component.html',
  styleUrls: ['./empleo-candidatos.component.scss'],
})
export class EmpleoCandidatosComponent implements OnDestroy, OnInit {
  private router = inject(Router);
  private empresaService = inject(EmpresaService);
  private activatedRoute = inject(ActivatedRoute);
  private mediatorService = inject(EventMediatorService);
  private storageService = inject(LocalstorageService);

  lstCandidatos: IResListarCandiPorEmpleoDet[] = [];
  suscriptionListar!: Subscription;
  unsuscriptionMediator!: Subscription;
  unsuscriptionDevice!: Subscription;
  objEmpleo!: IResListarEmpleosOpenCloseDet | null;
  jobId: number = 0;
  typeDevice: ITypeDevice | null = {
    isMobile: false,
    isDesktop: false,
    isTablet: false,
  };

  vEmpLogo = '';


  constructor() {    

    this.jobId = this.activatedRoute.snapshot.params['jobId'];
    this.cargarCandidatosPorEmpleo(this.jobId);
    // this.unsuscriptionMediator = this.mediatorService.empleoChanged.subscribe({
    //   next: (resp) => {
    //     this.objEmpleo = resp;
    //   },
    //   error: (err) => {
    //     console.log(err);
    //   },
    //   complete: () => {
    //     console.log('complete cargarCandidatosPorEmpleo()');
    //   },
    // });

    this.objEmpleo = this.storageService.getStorage('tempdata.ai');

    this.unsuscriptionDevice = this.mediatorService.deviceChanged.subscribe({
      next: (resp) => {
        this.typeDevice = resp;
      },
      error: (err) => {
        console.log(err);
      },
      complete: () => {
        console.log('complete mediatorService()');
      },
    });



  }
  ngOnInit(): void {
    const objLogin = JSON.parse(localStorage.getItem('laboral.ai')!);
    this.vEmpLogo = environment.epImagesPublic + '/' + objLogin.company.logo;
  }

  ngOnDestroy(): void {
    if (this.suscriptionListar) this.suscriptionListar.unsubscribe();
    if (this.unsuscriptionMediator) this.unsuscriptionMediator.unsubscribe();
    if (this.unsuscriptionDevice) this.unsuscriptionDevice.unsubscribe();
  }

  irRespuestas(candidato: IResListarCandiPorEmpleoDet) {
    this.mediatorService.notifyOnCandidatoChanged(candidato);
    this.router.navigate([
      '/manager/candidatos/' +
        this.jobId +
        '/respuestas/' +
        candidato.id_cliente,
    ]);
  }

  cargarCandidatosPorEmpleo(empleoId: number) {
    const req: IReqListarCandiPorEmpleo = {
      idJob: empleoId,
    };
    this.suscriptionListar = this.empresaService
      .listarCandidatosPorEmpleo(req)
      .subscribe({
        next: (resp) => {
          console.log(resp);
          this.lstCandidatos = resp.data;
        },
        error: (err) => {
          console.log(err);
        },
        complete: () => {
          console.log('complete listarCandidatosPorEmpleo()');
        },
      });
  }

  verSeleccionar(idcliente: number) {
    $('#modalSeleccionar').modal('show');
  }

  verEliminar(idcliente: number) {
    $('#modalEliminar').modal('show');
  }

  seleccionarCandidato() {
    $('#modalSeleccionar').modal('hide');
    $('#modalSeleccionado').modal('show');
  }

  eliminarCandidato() {
    $('#modalEliminar').modal('hide');
    $('#modalEliminado').modal('show');
  }
}
