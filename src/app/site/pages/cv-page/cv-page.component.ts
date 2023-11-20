import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { Capacidades, Experiencia, Formacion, Personal, SiteCv } from '../../interfaces/site-cv.interface';
import { HttpClient } from '@angular/common/http';
import { AbstractResponsive } from 'src/app/shared/components/abstract/abstract-responsive.component';

@Component({
  selector: 'app-cv-page',
  templateUrl: './cv-page.component.html',
  styleUrls: ['./cv-page.component.css']

})
export class CvPageComponent extends AbstractResponsive implements OnInit{

  // ------ constantes ------
  private mainUrl = 'assets/site-cv.json';
  public printUrl = '/site/cv';

  // ------ inject ------
  private http = inject(HttpClient);

  // ------ properties & signals ------
  public siteCv = signal<SiteCv | null>(null);

  public personal = computed<Personal | null>(() => this.siteCv() ? this.siteCv()!.personal : null);
  public experiencia = computed<Experiencia | null>(() => this.siteCv() ? this.siteCv()!.experiencia : null);
  public formacion = computed<Formacion | null>(() => this.siteCv() ? this.siteCv()!.formacion : null);
  public cursos = computed<Formacion | null>(() => this.siteCv() ? this.siteCv()!.cursos : null);
  public capacidades = computed<Capacidades | null>(() => this.siteCv() ? this.siteCv()!.capacidades : null);


  ngOnInit(): void {
    this.http.get<SiteCv>(this.mainUrl)
    .subscribe({
      next: (data) => {
        this.siteCv.set(data);
      }
    });
  }

  // ------ Eventos ------
  public togglePrintUrl(): void{
    if(this.printUrl === '/cv-print'){
      this.printUrl = '/site/cv';
    } else{
      this.printUrl = '/cv-print';
    }
  }

}
