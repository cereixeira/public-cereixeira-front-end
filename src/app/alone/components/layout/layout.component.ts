import { inject } from '@angular/core';
import { AuthService } from 'src/app/auth/services/auth.service';

export abstract class LayoutComponent{

  abstract get header(): string;

  abstract menuItems(): any[];

}
