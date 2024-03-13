import { AfterViewChecked, Component, Input } from '@angular/core';
import { IListaEmpleos } from '../../../interfaces/IListaEmpleos';
import { ClipboardService } from 'ngx-clipboard';

@Component({
  selector: 'app-detalle-empleo',
  templateUrl: './detalle-empleo.component.html',
  styleUrls: ['./detalle-empleo.component.scss'],
})
export class DetalleEmpleoComponent implements AfterViewChecked {
  @Input() empleo: IListaEmpleos = {
    id: 0,
    img: '',
    titulo: '',
    modalidad: '',
    descripcion: '',
    funciones: [],
    conocimientos: [],
    link: '',
  };
  contentUrl = '';

  constructor(private clipboardApi: ClipboardService) {
    this.contentUrl = this.empleo.link;
  }
  ngAfterViewChecked(): void {
    this.contentUrl = this.empleo.link;
  }

  editar() {}

  copyText() {
    this.clipboardApi.copy(this.contentUrl);
  }
}
