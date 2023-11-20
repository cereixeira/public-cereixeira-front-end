import { Injectable } from '@angular/core';
import { Capacidades, Experiencia, ExperienciaDato, Formacion, FormacionDato, Idioma, LangLevel, Personal, PersonalDatoExtra, SiteCv } from 'src/app/site/interfaces/site-cv.interface';
import { MetadataCvResponse } from '../interfaces/cv-response.interfaces';

@Injectable({
  providedIn: 'root'
})
export class FormHelperService {

  constructor() { }

  public getDocumentVersions(aResponse: MetadataCvResponse[]):any[]{
    let versions = [];
    aResponse = aResponse.sort(
      (a: MetadataCvResponse, b: MetadataCvResponse) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
      aResponse.reverse();

    for(let item of aResponse){
      versions.push({value: item.id, viewValue: item.version});
    }
    return versions
  }

  public getLanguageLevels(){
    return [
      {value: '', viewValue: ''},
      {value: LangLevel.bajo, viewValue: LangLevel.bajo},
      {value: LangLevel.medio, viewValue: LangLevel.medio},
      {value: LangLevel.alto, viewValue: LangLevel.alto},
      {value: LangLevel.muy_alto, viewValue: LangLevel.muy_alto},
    ];
  }

  public cvFormToJson(formValues: any): SiteCv{

    const personal: Personal = {
        titulo: formValues.personal.titulo,
        urlFoto: formValues.personal.urlFoto,
        nombre: formValues.personal.nombre,
        labelTelefono: formValues.personal.labelTelefono,
        telefono: formValues.personal.telefono,
        labelMail: formValues.personal.labelMail,
        mail: formValues.personal.mail,
        labelNacionalidad: formValues.personal.labelNacionalidad,
        nacionalidad: formValues.personal.nacionalidad,
        extra: this.getValuePersonalDatoExtra(formValues.personal.extra),
    };

    const profesional: Experiencia = {
      titulo: formValues.profesional.titulo,
      datos: this.getValueProfesionalDatos(formValues.profesional.datos)
    };

    const formacion: Formacion = {
      titulo: formValues.formacion.titulo,
      datos: this.getValueFormacionDatos(formValues.formacion.datos)
    };

    const cursos: Formacion = {
      titulo: formValues.cursos.titulo,
      datos: this.getValueCursosDatos(formValues.cursos.datos)
    };

    const capacidades: Capacidades = {
      titulo: formValues.capacidades.titulo,
      labelNativo: formValues.capacidades.labelNativo,
      nativo: formValues.capacidades.nativo,
      labelOtrosIdiomas: formValues.capacidades.labelOtrosIdiomas,
      labelLectura: formValues.capacidades.labelLectura,
      labelEscritura: formValues.capacidades.labelEscritura,
      labelOral: formValues.capacidades.labelOral,
      idiomas: this.getValueCapacidadesIdiomas(formValues.capacidades.idiomas),
      labelComunicacion: formValues.capacidades.labelComunicacion,
      comunicacion: formValues.capacidades.comunicacion,
      labelOrganizacion: formValues.capacidades.labelOrganizacion,
      organizacion: formValues.capacidades.organizacion,
      labelTecnicas: formValues.capacidades.labelTecnicas,
      tecnicas: formValues.capacidades.tecnicas,
      labelCarnet: formValues.capacidades.labelCarnet,
      carnet: formValues.capacidades.carnet,
    };

    const myCv: SiteCv = {
      personal: personal,
      experiencia: profesional,
      formacion: formacion,
      cursos: cursos,
      capacidades: capacidades,
    }
    return myCv;
  }
  private getValueCapacidadesIdiomas(formArray: any): Idioma[]{
    let aDatos: Idioma[] = [];
    if ( formArray ) {
      for (let index = 0; index < formArray.length; index++) {
        aDatos.push({
          titulo: formArray[index].titulo,
          lectura: formArray[index].lectura,
          escritura: formArray[index].escritura,
          oral: formArray[index].oral,
        });
      }
    }
    return aDatos;
  }
  private getValueCursosDatos(formArray: any): FormacionDato[]{
    let aDatos: FormacionDato[] = [];
    if ( formArray ) {
      for (let index = 0; index < formArray.length; index++) {
        aDatos.push({
          fechaIni: formArray[index].fechaIni,
          fechaFin: formArray[index].fechaFin,
          horas: formArray[index].horas,
          nombreCentro: formArray[index].nombreCentro,
          titulo: formArray[index].titulo,
          descripcion: formArray[index].descripcion
        });
      }
    }
    return aDatos;
  }
  private getValueFormacionDatos(formArray: any): FormacionDato[]{
    let aDatos: FormacionDato[] = [];
    if ( formArray ) {
      for (let index = 0; index < formArray.length; index++) {
        aDatos.push({
          fechaIni: formArray[index].fechaIni,
          fechaFin: formArray[index].fechaFin,
          nombreCentro: formArray[index].nombreCentro,
          titulo: formArray[index].titulo,
          descripcion: formArray[index].descripcion
        });
      }
    }
    return aDatos;
  }
  private getValueProfesionalDatos(formArray: any): ExperienciaDato[]{
    let aDatos: ExperienciaDato[] = [];
    if ( formArray ) {
      for (let index = 0; index < formArray.length; index++) {
        aDatos.push({
          fechaIni: formArray[index].fechaIni,
          fechaFin: formArray[index].fechaFin,
          puesto: formArray[index].puesto,
          empresa: formArray[index].empresa,
          descripcion: this.getValueProfesionalDatosDescripciones( formArray[index].descripciones ),
          tecnologias: formArray[index].tecnologias,
        });
      }
    }
    return aDatos;
  }
  private getValueProfesionalDatosDescripciones(formArray: any): string[]{
    let aDatos: string[] = [];
    if ( formArray ) {
      for (let index = 0; index < formArray.length; index++) {
        aDatos.push( formArray[index] );
      }
    }
    return aDatos;
  }
  private getValuePersonalDatoExtra(datosExtra: any): PersonalDatoExtra[]{
    let aDatos: PersonalDatoExtra[] = [];
    if ( datosExtra ) {
      for (let index = 0; index < datosExtra.length; index++) {
        aDatos.push({
          label: datosExtra[index].label,
          value: datosExtra[index].value
        });
      }
    }
    return aDatos;
  }



  // //------------------------------------------------------------------------------
  // public isErrorFieldInArray( formArray: any, index: number, field: string) {
  //   return formArray.controls[index].controls[field].errors
  //       && formArray.controls[index].controls[field].touched;
  // }
  // public getErrorFieldInArray( formArray: any, index: number, field: string ) {
  //   const formControl = formArray.controls[index].controls[field];

  //   if ( ! formControl ) return null;
  //   return this.getErrorFormControl(formControl);
  // }
  // public isErrorField(formGroup: FormGroup, field: string ): boolean | null {
  //   if( ! formGroup ) return false;
  //   const valid: boolean|null = formGroup.controls[field].errors
  //     && formGroup.controls[field].touched;
  //   return valid;
  // }
  // public getErrorField(formGroup: FormGroup, field: string ): string | null {
  //   const formControl = formGroup.controls[field];
  //   if ( ! formControl ) return null;
  //   return this.getErrorFormControl(formControl);
  // }

  // public getErrorFormControl( formControl: any ): string | null {
  //   const errors = formControl.errors || {};

  //   for (const key of Object.keys(errors) ) {
  //     switch( key ) {
  //       case 'required':
  //         return 'Este campo es requerido';

  //       case 'minlength':
  //         return `Mínimo ${ errors['minlength'].requiredLength } caracters.`;

  //       case 'email':
  //         return `El campo no tienen un formato de email`
  //     }
  //   }
  //   return null;
  // }
}
