import { NgModule } from '@angular/core';
import { RouterModule, Routes, provideRouter, withComponentInputBinding } from '@angular/router';
import { ManagerComponent } from './pages/manager-page/manager.component';
import { LayoutPageComponent } from './pages/layout-page/layout-page.component';
import { isAuthenticatedGuard } from '../auth/guards/is-authenticated.guard';
import { isRoleAdminGuard } from '../auth/guards/is-role-admin.guard';

const routes: Routes = [
  {
    path:'',
    component: LayoutPageComponent,
    children:[
      {
        path: 'manager',
        canActivate: [ isAuthenticatedGuard, isRoleAdminGuard ],
        component: ManagerComponent
      },
      {
        path: '**',
        redirectTo: '/404'
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
export class AdminRoutingModule { }
