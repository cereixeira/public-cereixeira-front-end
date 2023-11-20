import { Component, Input, OnInit, computed, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  templateUrl: './register-page.component.html',
  styleUrls: ['./register-page.component.css']
})
export class RegisterPageComponent implements OnInit{

  // --------- inject ---------
  private fb = inject( FormBuilder );
  private authService = inject(AuthService);
  private router = inject(Router);

  // --------- params ---------
  @Input()
  public id = '';

  // --------- signal ---------
  public name = signal<string> ('');
  public email = signal<string> ('');
  public password = signal<string> ('');
  private _progressBarModeDeterminate = signal<boolean>(true);

  // --------- computed ---------
  public progressBarValue = computed<number> (() => {
    return (this.name() ? 33 : 0) + (this.email() ? 33 : 0) + (this.password().length > 5 ? 33 : 0);
  });
  public progressBarModeDeterminate = computed<boolean> (() => {
    return this._progressBarModeDeterminate();
  });

  // --------- properties ---------
  public registerFormGroup!: FormGroup;

  public ngOnInit(): void {
    this.email.set(this.id);
    this.registerFormGroup = this.createRegisterFormGroup();
    //this.updateForm();
  }

  // private updateForm(){
  //   this.registerFormGroup.patchValue({
  //     name: this.name(),
  //     email: this.email(),
  //     password: this.password(),
  //   });
  // }

  private createRegisterFormGroup(): FormGroup {
    return this.fb.group({
      name: ['', Validators.required],
      email: [this.email() ? this.email() : '', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  public onRegister(){
    this._progressBarModeDeterminate.set(false);
    const {name, email, password} = this.registerFormGroup.value;

    this.authService.register(name, email, password)
      .subscribe({
        next: (result) => {
          Swal.fire('Validar Usuario',
            'Usuario creado pero no validado.<br/>'+
            'Se ha enviado un correo con un token.<br/>'+
            'Para completar la validación copie y pegue el token en el siguiente formulario',
            'info');
          this.router.navigate(['/auth/validate-token'],{queryParams: {id: email }});
          //this.router.navigateByUrl('/auth/validate-token?id='+email);
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


}
