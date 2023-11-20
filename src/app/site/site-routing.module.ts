import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutPageComponent } from './pages/layout-page/layout-page.component';
import { MainPageComponent } from './pages/main-page/main-page.component';
import { CvPageComponent } from './pages/cv-page/cv-page.component';
import { ProjectsPageComponent } from './pages/projects-page/projects-page.component';
import { AboutPageComponent } from './pages/about-page/about-page.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutPageComponent,
    children: [
      {
        path: 'main',
        component: MainPageComponent
      },
      {
        path: 'cv',
        component: CvPageComponent
      },
      // {
      //   path: 'projects',
      //   component: ProjectsPageComponent
      // },
      {
        path: 'about',
        component: AboutPageComponent
      },
      {
        path: '**', // path vacio (por defecto)
        redirectTo: 'main'
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SiteRoutingModule { }
