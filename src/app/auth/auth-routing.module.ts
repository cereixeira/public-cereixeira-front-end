import { NgModule } from '@angular/core';
import { RouterModule, Routes, provideRouter, withComponentInputBinding } from '@angular/router';
import { AuthLayoutComponent } from './layout/auth-layout/auth-layout.component';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { RegisterPageComponent } from './pages/register-page/register-page.component';
import { ValidateTokenPageComponent } from './pages/validate-token-page/validate-token-page.component';
import { RestorePasswordPageComponent } from './pages/restore-password-page/restore-password-page.component';

const routes: Routes = [
  {
    path:'',
    component: AuthLayoutComponent,
    children:[
      {
        path: 'login',
        component: LoginPageComponent
      },
      {
        path: 'register',
        component: RegisterPageComponent
      },
      {
        path: 'validate-token',
        component: ValidateTokenPageComponent
      },
      {
        path: 'restore-password',
        component: RestorePasswordPageComponent
      },
      // {
      //   path: 'register/:id',
      //   component: RegisterPageComponent
      // },
      {
        path: '**',
      redirectTo: 'login'
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
export class AuthRoutingModule { }
