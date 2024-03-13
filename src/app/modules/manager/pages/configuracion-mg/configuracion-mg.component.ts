import { Component } from '@angular/core';

declare var $:any;

@Component({
  selector: 'app-configuracion-mg',
  templateUrl: './configuracion-mg.component.html',
  styleUrls: ['./configuracion-mg.component.scss'],
})
export class ConfiguracionMgComponent {
  showPerfil = false;
  showPwd = false;

  constructor() {}

  ngOnInit(): void {
    this.showPerfil = true;
  }

  showModal(event:boolean){
    $('#modalEdit').modal('show');
  }
}
