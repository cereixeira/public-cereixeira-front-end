import { NgModule } from '@angular/core';
import { RouterModule, Routes, withComponentInputBinding, provideRouter} from '@angular/router';
import { Error404PageComponent } from './shared/pages/error404-page/error404-page.component';
import { CvPageComponent } from './site/pages/cv-page/cv-page.component';
import { isAuthenticatedGuard } from './auth/guards/is-authenticated.guard';
import { isNotAuthenticatedGuard } from './auth/guards/is-not-athenticated.guard';
import { isRoleCustomGuard } from './auth/guards/is-role-custom.guard';
import { isRoleAdminGuard } from './auth/guards/is-role-admin.guard';
import { CvViewPageComponent } from './user/pages/cv-view-page/cv-view-page.component';

const routes: Routes = [
  {
    path: 'site',
    loadChildren: () => import('./site/site.module').then(m => m.SiteModule)
  },
  {
    path: 'auth',
    canActivate: [ isNotAuthenticatedGuard ],
    loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule)
  },
  {
    path: 'user',
    canActivate: [ isAuthenticatedGuard, isRoleCustomGuard ],
    loadChildren: () => import('./user/user.module').then(m => m.UserModule)
  },
  {
    path: 'admin',
    canActivate: [ isAuthenticatedGuard, isRoleAdminGuard ],
    loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule)
  },
  {
    path: 'cv-print',
    component: CvPageComponent
  },
  {
    path: 'cv-user-print',
    canActivate: [ isAuthenticatedGuard, isRoleCustomGuard ],
    component: CvViewPageComponent
  },
  {
    path: 'cv-user-print/:selectedVersion',
    canActivate: [ isAuthenticatedGuard, isRoleCustomGuard ],
    component: CvViewPageComponent
  },
  {
    path: '404',
    component: Error404PageComponent
  },
  // por defecto
  {
    path: '',
    redirectTo: 'site', pathMatch: 'full'
  },
  // cualquiera que no sea alguno de los anteriores
  {
    path: '**',
    redirectTo: '404'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes/*, { useHash: true }*/)],
  exports: [RouterModule],
  providers:[
    provideRouter(routes, withComponentInputBinding())
  ]
})
export class AppRoutingModule { }
