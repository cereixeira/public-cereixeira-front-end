import { HttpClient } from '@angular/common/http';
import { Component, OnInit, inject, signal } from '@angular/core';
import { SiteAbout } from '../../interfaces/site-about.interface';
import { AbstractResponsive } from 'src/app/shared/components/abstract/abstract-responsive.component';

@Component({
  selector: 'app-about-page',
  templateUrl: './about-page.component.html',
  styleUrls: ['./about-page.component.css']
})
export class AboutPageComponent extends AbstractResponsive implements OnInit{

  // ------ constantes ------
  private mainUrl = 'assets/site-about.json';

  // ------ inject ------
  private http = inject(HttpClient);

  // ------ properties & signals ------
  public siteAbout = signal<SiteAbout|null>(null);

  ngOnInit(): void {
    this.http.get<any>(this.mainUrl)
    .subscribe({
      next: (data) => {
        this.siteAbout.set(data);
      }
    });
  }

}
