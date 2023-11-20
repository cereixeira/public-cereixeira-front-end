import { Component, OnInit, inject, signal } from '@angular/core';
import { LayoutComponent } from 'src/app/alone/components/layout/layout.component';

@Component({
  selector: 'site-layout-page',
  templateUrl: './layout-page.component.html',
  styleUrls: ['./layout-page.component.css']
})
export class LayoutPageComponent extends LayoutComponent implements OnInit{

  override get header():string{
    return 'CEREIXEIRA'
  }

  override menuItems = signal<any[]>( [
    { label: $localize`Principal`, icon: 'home', url: './main'},
    { label: `CV`, icon: 'insert_drive_file', url: './cv'},
    // { label: $localize`Proyectos`, icon: 'folder', url: './projects'},
    { label: $localize`Acerca de`, icon: 'info', url: './about'},
   ]);

// -----------------------------------------------------------------
  ngOnInit(): void {
    // this.authService.checkAuthStatus()
    //   .subscribe();
  }
}
