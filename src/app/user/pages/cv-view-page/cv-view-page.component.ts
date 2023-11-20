import { Component, OnInit, inject, signal, computed, Input, ViewChild } from '@angular/core';
import { Capacidades, Experiencia, Formacion, Personal, SiteCv } from 'src/app/site/interfaces/site-cv.interface';
import { Router } from '@angular/router';
import { AbstractResponsive } from 'src/app/shared/components/abstract/abstract-responsive.component';
import { SelectVersion } from 'src/app/alone/interfaces/select-version.interface';
import { SelectVersionComponent } from 'src/app/alone/components/select-version/select-version.component';

@Component({
  selector: 'app-cv-view-page',
  templateUrl: './cv-view-page.component.html',
  styleUrls: ['./cv-view-page.component.css']
})
export class CvViewPageComponent extends AbstractResponsive implements OnInit{

  @ViewChild('id_select_version')
  selectVersionComponent?: SelectVersionComponent;

  // ------ inject ------
  protected router = inject(Router);

  // ------ properties & signals ------
  @Input()
  public selectedVersion: string = '';

  public siteCv = signal<SiteCv | null>(null);
  public hiddenSpinner = signal<boolean>(false);

  public personal = computed<Personal | null>(() => this.siteCv() ? this.siteCv()!.personal : null);
  public experiencia = computed<Experiencia | null>(() => this.siteCv() ? this.siteCv()!.experiencia : null);
  public formacion = computed<Formacion | null>(() => this.siteCv() ? this.siteCv()!.formacion : null);
  public cursos = computed<Formacion | null>(() => this.siteCv() ? this.siteCv()!.cursos : null);
  public capacidades = computed<Capacidades | null>(() => this.siteCv() ? this.siteCv()!.capacidades : null);

  // ------ Eventos ------
  ngOnInit(): void {
    console.log('#ngOnInit');
    this.hiddenSpinner.set(true);
    console.log('#ngOnInit - selectedVersion: '+this.selectedVersion);
    if(this.selectedVersion){
      this.selectVersionComponent?.onSelectValueChange(this.selectedVersion);
    }
  }

  isPrintPage(){
    //console.log('#isPrintPage - url: '+this.router.url)
    return this.router.url.includes('/cv-user-print');
  }

  onPrint(){
    console.log('#onPrint - selectedVersion: '+this.selectedVersion);
    this.router.navigateByUrl('/cv-user-print?selectedVersion='+this.selectedVersion);
    //this.router.navigateByUrl('/cv-user-print/'+this.selectedVersion);
  }

  onSelectValueChange(data: SelectVersion){
    console.log('#onSelectValueChange - cvId: '+data.cvId);
    this.selectedVersion = data.cvId;
    this.siteCv.set( JSON.parse(data.document) );
    this.hiddenSpinner.set(true);
  }

}
