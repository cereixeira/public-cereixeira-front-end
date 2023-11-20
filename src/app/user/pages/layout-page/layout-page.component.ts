import { Component, OnInit, inject, signal } from '@angular/core';
import { LayoutComponent } from 'src/app/alone/components/layout/layout.component';
import { AuthService } from 'src/app/auth/services/auth.service';

@Component({
  selector: 'user-layout-page',
  templateUrl: './layout-page.component.html',
  styleUrls: ['./layout-page.component.css']
})
export class LayoutPageComponent extends LayoutComponent implements OnInit{

  //private readonly authService = inject(AuthService);

  override get header():string{
    return 'USER'
  }

  override menuItems = signal<any[]>( [
    { label: $localize`Principal`, icon: 'home', url: '/site'},
    { label: $localize`Ver CV`, icon: 'insert_drive_file', url: './cv/view'},
    { label: $localize`Editar CV`, icon: 'mode_edit', url: './cv/edit'},
   ]);

  ngOnInit(): void {
    // this.authService.checkAuthStatus()
    //   .subscribe();
  }

}
