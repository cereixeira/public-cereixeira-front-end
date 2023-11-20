import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SiteRoutingModule } from './site-routing.module';
import { LayoutPageComponent } from './pages/layout-page/layout-page.component';
import { MainPageComponent } from './pages/main-page/main-page.component';
import { CvPageComponent } from './pages/cv-page/cv-page.component';
import { ProjectsPageComponent } from './pages/projects-page/projects-page.component';
import { AboutPageComponent } from './pages/about-page/about-page.component';
import { MaterialModule } from '../material/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { RightMenuComponent } from '../alone/components/right-menu/right-menu.component';
import { LeftMenuComponent } from '../alone/components/left-menu/left-menu.component';
import { SharedModule } from '../shared/shared.module';
import { SimpleDatePipePipe } from '../alone/pipes/simple-date-pipe.pipe';


@NgModule({
  declarations: [
    LayoutPageComponent,
    MainPageComponent,
    CvPageComponent,
    ProjectsPageComponent,
    AboutPageComponent,
  ],
  imports: [
    CommonModule,
    SiteRoutingModule,
    ReactiveFormsModule,
    MaterialModule,
    RightMenuComponent,
    LeftMenuComponent,
    SharedModule,
    SimpleDatePipePipe
  ]
})
export class SiteModule { }
