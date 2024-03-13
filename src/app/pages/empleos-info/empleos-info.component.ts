import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { GeneralService } from 'src/app/Services/general.service';
import { IResEmpleoByIdData } from 'src/app/interfaces/IResEmpleoById';
import { ClipboardService } from 'ngx-clipboard';

@Component({
  selector: 'app-empleos-info',
  templateUrl: './empleos-info.component.html',
  styleUrls: ['./empleos-info.component.scss'],
})
export class EmpleosInfoComponent implements OnInit {
  private activatedRoute = inject(ActivatedRoute);
  private generalService = inject(GeneralService);
  jobId = '';
  subscriptionlistarEmpleoPorId!: Subscription;
  empleo:IResEmpleoByIdData={
    id_job_description: 0,
    job_title: '',
    job_offer_link: '',
    company: '',
    req_qualifications: '',
    pref_qualifications: '',
    key_responsabilities: '',
    techskill_tool: '',
    language: '',
    knowledge: '',
    softskills: '',
    career_background: '',
    location: '',
    salary: 0,
    date_entry: '',
    date_expiration: '',
    number_positions: 0,
    status: '',
    nps: '',
    modality: ''
  };
  bol_loading=false;
  contentUrl = '';
  constructor( private clipboardApi: ClipboardService) {
    this.jobId = this.activatedRoute.snapshot.params['token'];
    console.log('id job::', this.jobId);
  }
  ngOnInit(): void {
    const req: any = {
      idJob: this.jobId,
    };
    this.bol_loading = true;
    this.subscriptionlistarEmpleoPorId = this.generalService
      .listarEmpleoPorId(req)
      .subscribe({
        next: (resp) => {
          console.log(resp);
          this.empleo = resp.data;          
          this.bol_loading = false;
          this.contentUrl = resp.data.job_offer_link;
        },
        error: (err) => {
          console.log(err);
          this.bol_loading = false;
        },
        complete: () => {
          console.log('Complete listarEmpleoPorId()');
        },
      });
  }

  copyText(){
    console.log('entor aki',this.contentUrl);
    
    this.clipboardApi.copy(this.contentUrl);
  }
}