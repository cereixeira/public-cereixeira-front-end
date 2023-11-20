import { inject } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { MatSnackBar } from "@angular/material/snack-bar";

export abstract class AbstractForm{

  private snackBar = inject(MatSnackBar);

  public get requiredHint(){ return 'requerido'; }

  //------------------------------------------------------------------------------
  public isErrorFieldInArray( formArray: any, index: number, field: string) {
    return formArray.controls[index].controls[field].errors
        && formArray.controls[index].controls[field].touched;
  }
  public getErrorFieldInArray( formArray: any, index: number, field: string ) {
    const formControl = formArray.controls[index].controls[field];

    if ( ! formControl ) return null;
    return this.getErrorFormControl(formControl);
  }
  public isErrorField(formGroup: FormGroup, field: string ): boolean | null {
    if( ! formGroup ) return false;
    const valid: boolean|null = formGroup.controls[field].errors
      && formGroup.controls[field].touched;
    return valid;
  }
  public getErrorField(formGroup: FormGroup, field: string ): string | null {
    const formControl = formGroup.controls[field];
    if ( ! formControl ) return null;
    return this.getErrorFormControl(formControl);
  }

  public getErrorFormControl( formControl: any ): string | null {
    const errors = formControl.errors || {};

    for (const key of Object.keys(errors) ) {
      switch( key ) {
        case 'required':
          return 'Este campo es requerido';

        case 'minlength':
          return `Mínimo ${ errors['minlength'].requiredLength } caracters.`;

        case 'email':
          return `El campo no tienen un formato de email`
      }
    }
    return null;
  }


//-----------------------------------------------------------------------------
openSnackBar(message: string, action: string) {
  this.snackBar.open(message, action, {
    horizontalPosition:'center',
    verticalPosition:'top',
    duration: 1800,
  });
}

}
