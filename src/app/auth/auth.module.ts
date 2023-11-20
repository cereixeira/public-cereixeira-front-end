import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthRoutingModule } from './auth-routing.module';

import { LoginPageComponent } from './pages/login-page/login-page.component';
import { RegisterPageComponent } from './pages/register-page/register-page.component';
import { AuthLayoutComponent } from './layout/auth-layout/auth-layout.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../material/material.module';
import { ValidateTokenPageComponent } from './pages/validate-token-page/validate-token-page.component';
import { RestorePasswordPageComponent } from './pages/restore-password-page/restore-password-page.component';
import { ConfirmDialogComponent } from '../alone/components/confirm-dialog/confirm-dialog.component';

@NgModule({
  declarations: [
    LoginPageComponent,
    RegisterPageComponent,
    AuthLayoutComponent,
    ValidateTokenPageComponent,
    RestorePasswordPageComponent
  ],
  imports: [
    CommonModule,
    AuthRoutingModule,
    ReactiveFormsModule,
    MaterialModule,
    ConfirmDialogComponent,
  ]
})
export class AuthModule { }
