import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Error404PageComponent } from './pages/error404-page/error404-page.component';
//import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../material/material.module';
import { CustomLabelDirective } from './directives/custom-label.directive';



@NgModule({
  declarations: [
    Error404PageComponent,
    CustomLabelDirective,
  ],
  imports: [
    CommonModule,
    MaterialModule,
  ],
  exports: [
    Error404PageComponent,
    CustomLabelDirective,
  ]
})
export class SharedModule { }
