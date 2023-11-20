import { NgModule } from '@angular/core';
import { RouterModule, Routes, provideRouter, withComponentInputBinding } from '@angular/router';
import { LayoutPageComponent } from './pages/layout-page/layout-page.component';
import { CvEditPageComponent } from './pages/cv-edit-page/cv-edit-page.component';
import { CvViewPageComponent } from './pages/cv-view-page/cv-view-page.component';
import { UserMainPageComponent } from './pages/user-main-page/user-main-page.component';
import { isRoleCustomGuard } from '../auth/guards/is-role-custom.guard';
import { isAuthenticatedGuard } from '../auth/guards/is-authenticated.guard';

const routes: Routes = [
  {
    path: '',
    component: LayoutPageComponent,
    children: [
      {
        path: 'main',
        component: UserMainPageComponent
      },
      {
        path: 'cv/edit',
        canActivate: [ isAuthenticatedGuard, isRoleCustomGuard ],
        component: CvEditPageComponent
      },
      {
        path: 'cv/view',
        canActivate: [ isAuthenticatedGuard, isRoleCustomGuard ],
        component: CvViewPageComponent
      },
      {
        path: '**',
        redirectTo: 'main'
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers:[
    provideRouter(routes, withComponentInputBinding())
  ]
})
export class UserRoutingModule { }
