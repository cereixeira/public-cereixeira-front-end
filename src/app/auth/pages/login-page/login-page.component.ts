import { Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from 'src/app/alone/components/confirm-dialog/confirm-dialog.component';

@Component({
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent {

  private fb = inject( FormBuilder );
  private authService = inject(AuthService);
  private router = inject(Router);
  private dialog = inject( MatDialog );

  public email = signal<string> ('');
  public password = signal<string> ('');


  public loginFormGroup: FormGroup = this.fb.group({
    email: [this.email(), [Validators.required, Validators.email]],
    password: [this.password(), [Validators.required, Validators.minLength(6)]],
  });
  private _progressBarModeDeterminate = signal<boolean>(true);

  public progressBarValue = computed<number> (() => {
    return (this.email() ? 50 : 0) + (this.password().length > 5 ? 50 : 0);
  });
  public progressBarModeDeterminate = computed<boolean> (() => {
    return this._progressBarModeDeterminate();
  });

  public login(){
    //console.log('#LoginPageComponent - login()');

    this._progressBarModeDeterminate.set(false);
    const {email, password} = this.loginFormGroup.value;

    this.authService.login(email, password)
      .subscribe({
        next: () => this.router.navigateByUrl('/user'),
        error: (err) => {
          this._progressBarModeDeterminate.set(true);
          let messageHtml: string = '';
          const {statusCode, message} = err;
          console.log('login - statusCode:'+statusCode+', message:'+message);
          switch(statusCode){
            case 499:{
              this.authService.sendToken(email)
                .subscribe();
              messageHtml = 'Complete la validación de usuario en la siguiente pantalla.<br/>' +
                '<ol style=\"text-align: left\">'+
                '<li>Revisar correo, copiar y pegar token en formulario</li>'+
                '<li>Pulsar botón de \'Validar\'</li></ol>';
              Swal.fire('Completar validación', messageHtml, 'info');
              this.router.navigate(['/auth/validate-token'],{queryParams: {id: email }});
              break;
            }
            default:{
              if( Array.isArray(message) ){
                for(let msg of message){
                  messageHtml = msg + '<br/>';
                }
              }else{
                messageHtml = message
              }
            }
            Swal.fire('Error', messageHtml, 'error');
          }
        }
      });
  }

  public onForgottenPassword() {
    const email: string = this.loginFormGroup.value.email;
    const dialogRef = this.dialog.open(ConfirmDialogComponent,{
        width: '550px',
        height: '220px',
        data: {
          dialogTitle: 'Recuperación de contraseña', dialogText: 'Enviar un mensaje a la dirección '+email+'\' con un token para crear una nueva contraseña.'}
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result){
        let messageHtml: string = '';
        this.authService.sendToken(email)
          .subscribe({
            next: () => {
              //this.tokenEnviado(email);
              messageHtml = 'El token ha sido enviado la cuenta '+email;
              Swal.fire('Exito', messageHtml, 'success');
              this.router.navigate(['/auth/restore-password'],{queryParams: {id: email }})
            },
            error: (message) => {
              this._progressBarModeDeterminate.set(true);
              let messageHtml;
              if( Array.isArray(message) ){
                for(let msg of message){
                  messageHtml = msg + "<br/>";
                }
              }else{
                messageHtml = message
              }
              Swal.fire('Error', messageHtml, 'error');
            }
          });
      }
    });
  }

  // private tokenEnviado(email: string){
  //   Swal.fire({
  //     icon: 'success',
  //     title: 'El token ha sido enviado la cuenta '+email,
  //     showConfirmButton: false,
  //     timer: 3200
  //   });
  // }

}
