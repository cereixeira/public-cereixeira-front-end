import { Component, EventEmitter, Input, OnInit, Output, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MaterialModule } from 'src/app/material/material.module';
import { CvService } from 'src/app/user/services/cv.service';
import { FormHelperService } from 'src/app/user/services/form-helper.service';

@Component({
  selector: 'app-select-version',
  standalone: true,
  imports: [CommonModule, RouterModule, MaterialModule],
  templateUrl: './select-version.component.html',
  styleUrls: ['./select-version.component.css']
})
export class SelectVersionComponent implements OnInit{

  // ------ inject ------
  private cvService = inject(CvService);
  private formHelper = inject(FormHelperService);

  // ------ properties & signals ------
  @Input()
  public loadVersion: string = '';

  public selectedVersion = signal<string> ('');
  public aVersions = signal<any[]>([]);

  get selectLabel(): string{
    if(this.aVersions().length > 0) return `Versión actual`;
    else return  `No encontrado`;
  }

  @Output()
  public onCvData = new EventEmitter<any>();

  // ------ Eventos ------
  ngOnInit(): void {
    console.log('└─ #ngOnInit');
    this.cvService.getCvVersions()
      .subscribe(data => {
        if( data && data.length > 0 ){
          let aVersionsDB = this.formHelper.getDocumentVersions(data);
          this.aVersions.set(aVersionsDB);
          //console.log('└─ #ngOnInit - selectedVersion: '+this.selectedVersion);
          if( this.loadVersion ){
            this.selectedVersion.set(this.loadVersion);
          } else{
            const cvId = data[0].id;
            this.selectedVersion.set(cvId);
          }
          this.onSelectValueChange(this.selectedVersion());
        } else{
          this.selectedVersion.set('');
          this.aVersions.set([]);
        }
      });
  }

  public onSelectValueChange(cvId: string){
    console.log('└─ #onSelectValueChange - '+cvId);
    if(cvId){
      // se carga versión desde BD
      this.selectedVersion.set(cvId);

      this.cvService.getCvById(cvId)
        .subscribe(data => {
          this.onCvData.emit({
            document: data.document,
            cvId: cvId
          })
        });
    }
  }

}
