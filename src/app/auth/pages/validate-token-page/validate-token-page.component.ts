import { Component, Input, OnInit, computed, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-validate-token-page',
  templateUrl: './validate-token-page.component.html',
  styleUrls: ['./validate-token-page.component.css']
})
export class ValidateTokenPageComponent implements OnInit{
  // --------- inject ---------
  private fb = inject( FormBuilder );
  private authService = inject(AuthService);
  private router = inject(Router);

  // --------- params ---------
  @Input()
  public id = '';

  // --------- signal ---------
  public email = signal<string> ('');
  public token = signal<string> ('');
  private _progressBarModeDeterminate = signal<boolean>(true);

  // --------- computed ---------
  public progressBarValue = computed<number> (() => {
    return (this.email() ? 50 : 0) + (this.token() ? 50 : 0);
  });
  public progressBarModeDeterminate = computed<boolean> (() => {
    return this._progressBarModeDeterminate();
  });

  // --------- properties ---------
  public validateTokenFormGroup!: FormGroup;

  public ngOnInit(): void {
    this.email.set(this.id);
    this.validateTokenFormGroup = this.createFormGroup();
    //this.messageInfoToken();
  }

  private createFormGroup(): FormGroup {
    return this.fb.group({
      email: [this.email() ? this.email() : '', [Validators.required, Validators.email]],
      token: ['', [Validators.required]],
    });
  }

  public onValidate(){
    console.log('#ValidateTokenPageComponent - onValidate');
    this._progressBarModeDeterminate.set(false);
    const{email, token} = this.validateTokenFormGroup.value;
    this.authService.validateRegister(email, token.trim())
      .subscribe({
        next: (result) => {
          Swal.fire('Usuario validado', 'La creación de usuario se ha completado con éxito', 'success');
          //this.messageFinalOk();
          // this.router.navigate(['/auth/login'],{queryParams: {email: email }});
          this.router.navigateByUrl('/user/view');
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
      }
    );
  }

  public onResendToken(){
    console.log('#ValidateTokenPageComponent - onResendToken');
    const {email} = this.validateTokenFormGroup.value;
    this.authService.sendToken(email)
    .subscribe({
      next: () => {
        Swal.fire('Token enviado', 'El token ha sido enviado la cuenta '+email, 'success');
        this.router.navigate(['/auth/validate-token'],{queryParams: {id: email }})
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
}
