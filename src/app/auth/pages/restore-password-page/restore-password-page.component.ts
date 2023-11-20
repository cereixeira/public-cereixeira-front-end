import { Component, Input, computed, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-restore-password-page',
  templateUrl: './restore-password-page.component.html',
  styleUrls: ['./restore-password-page.component.css']
})
export class RestorePasswordPageComponent {
  // --------- inject ---------
  private fb = inject( FormBuilder );
  private authService = inject(AuthService);
  private router = inject(Router);

  // --------- params ---------
  @Input()
  public id = '';

  // --------- signal ---------
  public email = signal<string> ('');
  public password = signal<string> ('');
  public token = signal<string> ('');
  private _progressBarModeDeterminate = signal<boolean>(true);

  // --------- computed ---------
  public progressBarValue = computed<number> (() => {
    return (this.email() ? 33 : 0) + + (this.password().length > 5 ? 33 : 0) + (this.token() ? 34 : 0);
  });
  public progressBarModeDeterminate = computed<boolean> (() => {
    return this._progressBarModeDeterminate();
  });

  // --------- properties ---------
  public restorePasswordFormGroup!: FormGroup;

  public ngOnInit(): void {
    this.email.set(this.id);
    this.restorePasswordFormGroup = this.createRestorePasswordFormGroup();
  }

  private createRestorePasswordFormGroup(): FormGroup {
    return this.fb.group({
      email: [this.email() ? this.email() : '', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      token: ['', [Validators.required, Validators.minLength(100)]],
    });
  }

  public onRestore(){
    this._progressBarModeDeterminate.set(false);
    const {email, password, token} = this.restorePasswordFormGroup.value;

    //this.router.navigate(['/auth/restore-password'],{queryParams: {id: email }});
    this.authService.restorePassword(email, password, token)
      .subscribe({
        next: () => {
          this.tokenEnviado();
          this.router.navigateByUrl('/user');
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

  private tokenEnviado(){
    Swal.fire({
      icon: 'success',
      title: 'La nueva contraseña ha sido guardada',
      showConfirmButton: false,
      timer: 3200
    });
  }

}
