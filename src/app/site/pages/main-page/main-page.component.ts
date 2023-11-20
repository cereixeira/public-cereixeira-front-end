import { Component, OnInit, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SiteMain } from '../../interfaces/site-main.interface';
import { AbstractResponsive } from '../../../shared/components/abstract/abstract-responsive.component';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.css']
})
export class MainPageComponent extends AbstractResponsive implements OnInit{

  // ------ constantes ------
  private mainUrl = 'assets/site-main.json';

  // ------ inject ------
  private http = inject(HttpClient);

  // ------ properties & signals ------
  public siteMain!: SiteMain;

  ngOnInit(): void {
    this.http.get<any>(this.mainUrl)
    .subscribe({
      next: (data) => {
        this.siteMain = data;
      }
    });
  }

}
