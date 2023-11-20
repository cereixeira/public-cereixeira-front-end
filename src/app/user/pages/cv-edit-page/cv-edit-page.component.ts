import { Component, OnInit, ViewChild, inject, signal } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Capacidades, Experiencia, ExperienciaDato, Formacion, FormacionDato, Idioma, Personal, PersonalDatoExtra, SiteCv } from 'src/app/site/interfaces/site-cv.interface';

import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { FormHelperService } from '../../services/form-helper.service';
import { CvService } from '../../services/cv.service';
import Swal from 'sweetalert2';

import { AbstractForm } from '../abstract/abstract-form-page';
import { UploadImageService } from '../../services/upload-image.service';
import { ConfirmDialogComponent } from 'src/app/alone/components/confirm-dialog/confirm-dialog.component';
import { InputConfirmDialogComponent } from 'src/app/alone/components/input-confirm-dialog/input-confirm-dialog.component';
import { SelectVersionComponent } from 'src/app/alone/components/select-version/select-version.component';

class ImageSnippet {
  constructor(public src: string, public file: File) {}
}

@Component({
  selector: 'app-cv-edit-page',
  templateUrl: './cv-edit-page.component.html',
  styleUrls: ['./cv-edit-page.component.css']
})
export class CvEditPageComponent extends AbstractForm implements OnInit{
[x: string]: any;

  @ViewChild('id_select_version')
  selectVersionComponent?: SelectVersionComponent;
  // ------ inject ------
  private fb = inject( FormBuilder );

  private confirmDialog = inject(MatDialog);
  private inputDialog = inject(MatDialog);
  private sanitizer = inject(DomSanitizer);
  private formHelper = inject(FormHelperService);
  private cvService = inject(CvService);
  private uploadImageService = inject(UploadImageService);

  // ------ properties & signals ------
  public cvFormGroup: FormGroup = this.newCvFormGroup(null);
  public languageLevel = this.formHelper.getLanguageLevels();
  public selectedFile?: ImageSnippet;

  public cvJsonDownload = signal<SafeResourceUrl>(this.getSafeResource());
  public hiddenSpinner = signal<boolean>(false);
  public sSlideConfirmacionBorrar = signal<boolean>(true);
  public selectedVersion = signal<string>('');


  // ------ gets ------
  public get personal(): FormGroup{
    return this.cvFormGroup.get('personal') as FormGroup;
  }
  public get personalDatosExtra(): FormArray{
    return this.personal.get('extra') as FormArray;
  }
  public get profesional(): FormGroup{
    return this.cvFormGroup.get('profesional') as FormGroup;
  }
  public get profesionalDatos(): FormArray{
    return this.profesional.get('datos') as FormArray;
  }
  public getProfesionalDatosDescripcion(formArray: FormArray, index: number): FormArray{
    return formArray.controls[index].get('descripciones') as FormArray;
  }
  public get formacion(): FormGroup{
    return this.cvFormGroup.get('formacion') as FormGroup;
  }
  public get formacionDatos(): FormArray{
    return this.formacion.get('datos') as FormArray;
  }
  public get cursos(): FormGroup{
    return this.cvFormGroup.get('cursos') as FormGroup;
  }
  public get cursosDatos(): FormArray{
    return this.cursos.get('datos') as FormArray;
  }
  public get capacidades(): FormGroup{
    return this.cvFormGroup.get('capacidades') as FormGroup;
  }
  public get capacidadesIdiomas(): FormArray{
    return this.capacidades.get('idiomas') as FormArray;
  }

  // ------ Eventos ------
  ngOnInit(): void {
     console.log('#ngOnInit');

     this.selectedVersion.set('');
     this.cvFormGroup = this.newCvFormGroup(null);

     this.selectVersionComponent?.ngOnInit();

     this.hiddenSpinner.set(true);

  }

  onSelectJson(jsonInput: any) {
    console.log('#onSelectJson');
    const file: File = jsonInput.files[0];
    const reader = new FileReader();

    reader.onload = () => {
      const loadedCvJson = JSON.parse(reader.result!.toString());
      this.cvFormGroup = this.newCvFormGroup(loadedCvJson);
      this.cvFormGroup.markAsDirty();
    }
    reader.readAsText(file, 'UTF-8');
  }

  onSelectImg(imageInput: any) {
    console.log('#onSelectImg');
    const file: File = imageInput.files[0];
    const reader = new FileReader();

    reader.addEventListener('load', (event: any) => {
      this.selectedFile = new ImageSnippet(event.target.result, file);
      this.uploadImageService.uploadImage(this.selectedFile.file)
        .subscribe(data => {
          this.personal.patchValue({
            'urlFoto': data
          });
        });
    });
    reader.readAsDataURL(file);
  }

  onSlideBorrar(checked: boolean){
    this.sSlideConfirmacionBorrar.set(checked);
  }

  onDelete(): void{
    console.log('#onDelete - version: '+this.selectedVersion());

    const dialogRef = this.confirmDialog.open(ConfirmDialogComponent,{
      width: '400px',height: '200px',
      data: {
        dialogTitle: 'Borrar versión de documento',
        dialogText: 'Se continúa todo el trabajo se hará mierda.'}
      }
    );
    dialogRef.afterClosed()
      .subscribe(result => {
        if(result){
          this.cvService.deleteCv(this.selectedVersion())
            .subscribe({
              next: () => {
                this.ngOnInit();
              },
              error: (message) => {
                let messageHtml;
                if( Array.isArray(message) ){
                  for(let msg of message){
                    messageHtml = msg + "<br/>";
                  }
                }else{
                  messageHtml = message
                }
                this.hiddenSpinner.set(true);
                Swal.fire('Error', messageHtml, 'error');
              }
            });
        }
    });
  }

  // onLoad(): void{
  //   console.log('#onLoad');
  //   const dialogRef = this.confirmDialog.open(ConfirmDialogComponent,{
  //     width: '400px',height: '200px',
  //     data: {
  //       dialogTitle: 'Cargar datos desd BD',
  //       dialogText: 'Si continúa se perderán los cambios no guardados y se restaurarán los últimos datos guardados de la versión'}
  //     }
  //   );
  //   dialogRef.afterClosed()
  //     .subscribe(result => {
  //       if(result){
  //         this.cvService.getCvById(this.selectedVersion())
  //           .subscribe(data => {
  //             const docCv = JSON.parse(data.document);
  //             this.cvFormGroup = this.newCvFormGroup(docCv);
  //           });
  //       }
  //   });
  // }

  onReset(): void{
    console.log('#onReset');
    const dialogRef = this.confirmDialog.open(ConfirmDialogComponent,{
      width: '400px', height: '200px',
      data: {
        dialogTitle: 'Borrar datos formulario',
        dialogText: '¿Está seguro de hacer mierda los datos del formulario?'}
      }
    );
    dialogRef.afterClosed()
      .subscribe(result => {
        if(result){
          this.cvFormGroup.reset();
          this.cvFormGroup = this.newCvFormGroup(null);
        }
    });
  }

  onNew(){
    console.log('#onNew');

    this.onSave();
    const dialogRef = this.inputDialog.open(InputConfirmDialogComponent,{
      width: '500px', height: '250px',
      data: {
        dialogTitle: 'Nuevo Curriculum Vitae',
        dialogText: ''}
      }
    );
    dialogRef.afterClosed()
      .subscribe(result => {
        if(result){
          if( ! result.check_01 ){
            this.cvFormGroup = this.newCvFormGroup(null);
          }
          const docCv: SiteCv = this.formHelper.cvFormToJson( this.cvFormGroup.value );
          this.cvService.create(JSON.stringify( docCv ), result.input_01)
            .subscribe({
              next: () => {
                this.openSnackBar('La nueva versión del documento ha sido creada ','Aceptar');
                this.ngOnInit();
              },
              error: (message) => {
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

  onSelectValueChange(data: any){
    console.log('#onSelectValueChange');

    // se guarda versión actual
    this.onSave();

    // se carga id desde BD
    this.selectedVersion.set(data.cvId);

    if(data.document){
      // se carga documento desde BD
      const cvDoc = JSON.parse(data.document)
      this.cvFormGroup = this.newCvFormGroup(cvDoc);
    }
    this.hiddenSpinner.set(true);
  }

  onValidate(formGroup: FormGroup): void{
    console.log('#onValidate');

    if(formGroup.invalid){
      formGroup.markAllAsTouched();
      Swal.fire('Error', 'Error encontrado en la validación del formulario, algún campo está vacío o no cumple el formato requerido', 'error');
      return;
    }
    this.hiddenSpinner.set(true);
    this.openSnackBar('Los datos han sido Validados ','Aceptar');

    this.onSave();
  }

  onSave(): void{
    console.log('#onSave');

    if( !this.selectedVersion() ){
      console.log('#onSave - No hay seleccinada ninguna versión a guardar');
      return;
    }
    console.log('#onSave - version: '+this.selectedVersion());
    if(!this.cvFormGroup.dirty){
      console.log('#onSave - El formulario NO ha sido modificado');
      return;
    }
    console.log('#onSave - El formulario ha sido modificado');

    this.hiddenSpinner.set(false);

    const myCv: SiteCv = this.formHelper.cvFormToJson( this.cvFormGroup.value );

    this.cvService.updateCv(JSON.stringify(myCv), this.selectedVersion())
    .subscribe({
      next: () => {
        this.hiddenSpinner.set(true);
        this.openSnackBar('Los datos han sido Guardados ','Aceptar');
      },
      error: (message) => {
        let messageHtml;
        if( Array.isArray(message) ){
          for(let msg of message){
            messageHtml = msg + "<br/>";
          }
        }else{
          messageHtml = message
        }
        this.hiddenSpinner.set(true);
        Swal.fire('Error', messageHtml, 'error');
      }
    });
  }

//-----------------------------------------------------------------------------

  // ------ lógica interna ------
  private newCvFormGroup(siteCv:SiteCv|null) {
    const personal: Personal|null = siteCv ? siteCv.personal : null;
    const profesional: Experiencia|null = siteCv ? siteCv.experiencia : null;
    const formacion: Formacion|null = siteCv ? siteCv.formacion : null;
    const cursos: Formacion|null = siteCv ? siteCv.cursos : null;
    const capacidades: Capacidades|null = siteCv ? siteCv.capacidades : null;

    return this.fb.group({
      personal: this.fb.group({
        titulo: [personal!=null ? personal.titulo : $localize`Info. Personal`, [Validators.required]],
        urlFoto: [personal!=null ? personal.urlFoto : ''],
        nombre: [personal!=null ? personal.nombre : '', [Validators.required, Validators.minLength(5)]],
        labelTelefono: [ personal!=null ? personal.labelTelefono : $localize`Teléfono`, [Validators.required]],
        telefono: [personal!=null ? personal.telefono : '', [Validators.required, Validators.minLength(9)]],
        labelMail: [personal!=null ? personal.labelMail : $localize`Correo electrónico`, [Validators.required]],
        mail: [personal!=null ? personal.mail : '', [Validators.required, Validators.email]],
        labelNacionalidad: [personal!=null ? personal.labelNacionalidad : $localize`Nacionalidad`, [Validators.required]],
        nacionalidad: [personal!=null ? personal.nacionalidad : '', [Validators.required]],
        extra: this.fillPersonalDatosExtra(personal),
      }),

      profesional: this.fb.group({
        titulo: [profesional!=null ? profesional.titulo : $localize`Info. Profesional`, [Validators.required]],
        datos: this.fillProfesionalDatos(profesional),
      }),

      formacion: this.fb.group({
        titulo: [formacion!=null ? formacion.titulo : $localize`Formación académica`, [Validators.required]],
        datos: this.fillFormacionDatos(formacion),
      }),

      cursos: this.fb.group({
        titulo: [cursos!=null ? cursos.titulo : $localize`Cursos`, [Validators.required]],
        datos: this.fillCursosDatos(cursos),
      }),

      capacidades: this.fb.group({
        titulo: [capacidades!=null ? capacidades.titulo : $localize`Capacidades`, [Validators.required]],
        labelNativo: [capacidades!=null ? capacidades.labelNativo : $localize`Lengua materna`,[Validators.required]],
        nativo: [capacidades!=null ? capacidades.nativo : '',[Validators.required]],
        labelOtrosIdiomas: [capacidades!=null ? capacidades.labelOtrosIdiomas : $localize`Otros idiomas`],
        labelLectura: [capacidades!=null ? capacidades.labelLectura : $localize`Comprensión Lectora`],
        labelEscritura: [capacidades!=null ? capacidades.labelEscritura : $localize`Expresión Escrita`],
        labelOral: [capacidades!=null ? capacidades.labelOral : $localize`Expresión Oral`],
        idiomas: this.fillIdiomas(capacidades),
        labelComunicacion: [capacidades!=null ? capacidades.labelComunicacion : $localize`Aptitudes de Comunicación`, [Validators.required]],
        comunicacion: [capacidades!=null ? capacidades.comunicacion : '', [Validators.required]],
        labelOrganizacion: [capacidades!=null ? capacidades.labelOrganizacion : '', [Validators.required]],
        organizacion: [capacidades!=null ? capacidades.organizacion : '', [Validators.required]],
        labelTecnicas: [capacidades!=null ? capacidades.labelTecnicas : $localize`Capacidades Técnicas`],
        tecnicas: [capacidades!=null ? capacidades.tecnicas : ''],
        labelCarnet: [capacidades!=null ? capacidades.labelCarnet : $localize`Permiso circulación`],
        carnet: [capacidades!=null ? capacidades.carnet : ''],
      }),

    });
  }

  private newPersonalDatosExtraFormGroup(dato :PersonalDatoExtra|null): FormGroup {
    return this.fb.group({
      label: [dato!=null ? dato.label : '',[Validators.required]],
      value: [dato!=null ? dato.value : '',[Validators.required]]
    });
  }
  private newProfesionalDatosFormGroup(dato :ExperienciaDato|null): FormGroup {
    const aDescripciones = dato?.descripcion ? dato?.descripcion : null;
    return this.fb.group({
      fechaIni: [dato!=null ? dato.fechaIni : '',[Validators.required]],
      fechaFin: [dato!=null ? dato.fechaFin : '',[Validators.required]],
      puesto: [dato!=null ? dato.puesto : '',[Validators.required]],
      empresa: [dato!=null ? dato.empresa : '',[Validators.required]],
      tecnologias: [dato!=null ? dato.tecnologias : '',[Validators.required]],
      descripciones: this.fillProfesionalDatosDescripciones( aDescripciones ),
    });
  }
  private newFormacionDatosFormGroup(dato :FormacionDato|null): FormGroup {
    return this.fb.group({
      fechaIni: [dato!=null ? dato.fechaIni : ''],
      fechaFin: [dato!=null ? dato.fechaFin : '',[Validators.required]],
      nombreCentro: [dato!=null ? dato.nombreCentro : '',[Validators.required]],
      titulo: [dato!=null ? dato.titulo : '',[Validators.required]],
      descripcion: [dato!=null ? dato.descripcion : ''],
    });
  }
  private newCursosDatosFormGroup(dato :FormacionDato|null): FormGroup {
    return this.fb.group({
      fechaIni: [dato!=null ? dato.fechaIni : ''],
      fechaFin: [dato!=null ? dato.fechaFin : '',[Validators.required]],
      horas: [dato!=null ? dato.horas : ''],
      nombreCentro: [dato!=null ? dato.nombreCentro : '',[Validators.required]],
      titulo: [dato!=null ? dato.titulo : '',[Validators.required]],
      descripcion: [dato!=null ? dato.descripcion : ''],
    });
  }
  private newCapacidadesIdiomaFormGroup(idioma :Idioma|null): FormGroup {
    return this.fb.group({
      titulo: [idioma!=null ? idioma.titulo : '',[Validators.required]],
      lectura: [idioma!=null ? idioma.lectura : '',[Validators.required]],
      escritura: [idioma!=null ? idioma.escritura : '',[Validators.required]],
      oral: [idioma!=null ? idioma.oral : '',[Validators.required]],
    });
  }


  private fillPersonalDatosExtra(personal: Personal | null): FormArray{
    let formArray: FormArray = this.fb.array([]);
    if(personal != null){
      let personalDatosExtra = personal.extra;
      if(personalDatosExtra != null){
        for(let dato of personalDatosExtra){
          this.addPersonalDatosExtra(formArray, dato);
        }
      }
    }
    return formArray;
  }
  private fillProfesionalDatos(profesional: Experiencia | null): FormArray{
    let formArray: FormArray = this.fb.array([]);
    if(profesional != null){
      let datosProfesionales = profesional.datos;
      if(datosProfesionales){
        for(let dato of datosProfesionales){
          this.addProfesionalDato(formArray, dato);
        }
      }
    }
    return formArray;
  }
  private fillFormacionDatos(formacion: Formacion | null): FormArray{
    let formArray: FormArray = this.fb.array([]);
    if(formacion != null){
      let datos = formacion.datos;
      if(datos){
        for(let dato of datos){
          this.addFormacionDato(formArray, dato);
        }
      }
    }
    return formArray;
  }
  private fillCursosDatos(formacion: Formacion | null): FormArray{
    let formArray: FormArray = this.fb.array([]);
    if(formacion != null){
      let datos = formacion.datos;
      if(datos){
        for(let dato of datos){
          this.addCursosDato(formArray, dato);
        }
      }
    }
    return formArray;
  }
  private fillIdiomas(capacidades: Capacidades | null): FormArray{
    let formArray: FormArray = this.fb.array([]);
    if(capacidades != null){
      let idiomas = capacidades.idiomas;
      if(idiomas){
        for(let idioma of idiomas){
          this.addCapacidadesIdioma(formArray, idioma);
        }
      }
    }
    return formArray;
  }

  public addPersonalDatosExtra(formArray:FormArray, dato :PersonalDatoExtra|null) {
    formArray.push(this.newPersonalDatosExtraFormGroup(dato));
  }
  public addProfesionalDato(formArray:FormArray, dato :ExperienciaDato|null) {
    formArray.push(this.newProfesionalDatosFormGroup(dato));
  }
  public addFormacionDato(formArray:FormArray, dato :FormacionDato|null) {
    formArray.push(this.newFormacionDatosFormGroup(dato));
  }
  public addCursosDato(formArray:FormArray, dato :FormacionDato|null) {
    formArray.push(this.newCursosDatosFormGroup(dato));
  }
  public addCapacidadesIdioma(formArray:FormArray, idioma :Idioma|null) {
    formArray.push(this.newCapacidadesIdiomaFormGroup(idioma));
  }





  private fillProfesionalDatosDescripciones(aDescripciones: string[]|null): FormArray{
    let formArray: FormArray = this.fb.array([]);
    if(aDescripciones != null && aDescripciones.length > 0){
      for(let descripcion of aDescripciones){
        this.addProfesionalDatoDescripcion(formArray, descripcion);
      }
    }
    return formArray;
  }
  public addProfesionalDatoDescripcion(formArray:FormArray, dato :string|null) {
    formArray.push(this.newProfesionalDatoDescripcion(dato));
  }
  private newProfesionalDatoDescripcion(dato :string|null) {
    // returnnew FormControl(dato, Validators.required)
    return this.fb.control(dato!=null ? dato : '', Validators.required);
  }



//-----------------------------------------------------------------------------
  public removeFromArray(formArray: FormArray, index: number) {
    if(this.sSlideConfirmacionBorrar()){
      const dialogRef = this.confirmDialog.open(ConfirmDialogComponent,{
        width: '300px', height: '200px',
        data: {
          dialogTitle: 'Borrar',
          dialogText: 'Los datos se borrarán del formulario pero no del respaldo en Base de Datos.'}
        }
      );
      dialogRef.afterClosed()
        .subscribe(result => {
          if(result){
            formArray.removeAt(index);
          }
      });
    } else{
      formArray.removeAt(index);
    }
  }

//-----------------------------------------------------------------------------

  public getSafeResource(): SafeResourceUrl{
    const myCv: SiteCv = this.formHelper.cvFormToJson( this.cvFormGroup.value );
    const blob = new Blob([JSON.stringify(myCv)], { type: 'text/json' });
    return this.sanitizer.bypassSecurityTrustResourceUrl(window.URL.createObjectURL(blob));
  }


}
