import { Component, Input, OnInit,signal } from '@angular/core';
import { LayoutComponent } from 'src/app/alone/components/layout/layout.component';


@Component({
  selector: 'admin-layout-page',
  templateUrl: './layout-page.component.html',
  styleUrls: ['./layout-page.component.css']
})
export class LayoutPageComponent extends LayoutComponent implements OnInit{

  override get header(): string {
    return 'ADMIN';
  }

  override menuItems = signal( [
    { label: $localize`Principal`, icon: 'home', url: '/site'},
    { label: $localize`Gest. Usu.`, icon: 'mode_edit', url: './manager'},
   ]);

   ngOnInit(): void {

  }

}
