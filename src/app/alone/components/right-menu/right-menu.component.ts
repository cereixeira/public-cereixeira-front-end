import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from 'src/app/auth/services/auth.service';
import { Router, RouterModule } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { AuthStatus } from 'src/app/auth/interfaces/auth-status.enum';
import { AuthRol } from 'src/app/auth/interfaces/auth-rol.enum';
import { MaterialModule } from 'src/app/material/material.module';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-right-menu',
  standalone: true,
  imports: [CommonModule, RouterModule, MaterialModule, ConfirmDialogComponent],
  templateUrl: './right-menu.component.html',
  styleUrls: ['./right-menu.component.css']
})
export class RightMenuComponent {

  protected authService = inject(AuthService);
  protected router = inject(Router);
  protected dialog = inject(MatDialog);


  protected authenticated(): boolean {
    return this.authService.authStatus() === AuthStatus.authenticated;
  };

  protected userName():string | undefined {
    return this.authService.currentUser()?.name ;
  };

  protected isAdmin(): boolean|undefined{
    return this.authService.currentUser()?.roles.includes(AuthRol.admin);
  }
  protected isUser(): boolean|undefined{
    return this.authService.currentUser()?.roles.includes(AuthRol.custom);
  }
// ----------------------------------------------------------------
  protected onLogout() {
    const dialogRef = this.dialog.open(ConfirmDialogComponent,{
      width: '330px',
      height: '200px',
      data: {
        dialogTitle: 'LogOut', dialogText: '¿Está seguro de cerrar su sesión?'}
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.authService.logout();
        this.router.navigateByUrl('/site');
      }
    });
  }

}
