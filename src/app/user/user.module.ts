import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user-routing.module';
import { LayoutPageComponent } from './pages/layout-page/layout-page.component';
import { CvEditPageComponent } from './pages/cv-edit-page/cv-edit-page.component';
import { CvViewPageComponent } from './pages/cv-view-page/cv-view-page.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../material/material.module';
import { UserMainPageComponent } from './pages/user-main-page/user-main-page.component';
import { RightMenuComponent } from '../alone/components/right-menu/right-menu.component';
import { LeftMenuComponent } from '../alone/components/left-menu/left-menu.component';
import { ConfirmDialogComponent } from '../alone/components/confirm-dialog/confirm-dialog.component';
import { InputConfirmDialogComponent } from '../alone/components/input-confirm-dialog/input-confirm-dialog.component';
import { SelectVersionComponent } from '../alone/components/select-version/select-version.component';


@NgModule({
  declarations: [
    LayoutPageComponent,
    CvEditPageComponent,
    CvViewPageComponent,
    UserMainPageComponent,
  ],
  imports: [
    CommonModule,
    UserRoutingModule,
    ReactiveFormsModule,
    MaterialModule,
    RightMenuComponent,
    LeftMenuComponent,
    ConfirmDialogComponent,
    InputConfirmDialogComponent,
    SelectVersionComponent,
  ]
})
export class UserModule { }
