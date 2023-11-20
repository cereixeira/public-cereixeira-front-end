import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { LayoutPageComponent } from './pages/layout-page/layout-page.component';
import { ManagerComponent } from './pages/manager-page/manager.component';
import { AuthRoutingModule } from '../auth/auth-routing.module';
import { MaterialModule } from '../material/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { RightMenuComponent } from '../alone/components/right-menu/right-menu.component';
import { LeftMenuComponent } from '../alone/components/left-menu/left-menu.component';
import { ArrayToStringPipe } from '../alone/pipes/array-to-string.pipe';


@NgModule({
  declarations: [
    LayoutPageComponent,
    ManagerComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AdminRoutingModule,
    AuthRoutingModule,
    MaterialModule,
    SharedModule,
    RightMenuComponent,
    LeftMenuComponent,
    ArrayToStringPipe,
  ]
})
export class AdminModule { }
