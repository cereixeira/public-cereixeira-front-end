import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';
import { AuthRol } from '../interfaces/auth-rol.enum';

export const isRoleCustomGuard: CanActivateFn = (route, state) => {

  const authService = inject(AuthService);

  if (authService.currentUser() != null && authService.currentUser()?.roles.includes(AuthRol.custom)){
    return true;
  } else{
    return false;
  }
};
