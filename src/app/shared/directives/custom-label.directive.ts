import { Directive, ElementRef, Input, OnInit } from '@angular/core';
import { ValidationErrors } from '@angular/forms';

@Directive({
  selector: '[customLabel]'
})
export class CustomLabelDirective implements OnInit{

  private htmlElement?: ElementRef<HTMLElement>;
  private _errors?: ValidationErrors | null;

  @Input()
  public set text(text: string){
    this.setTexto(text);
  }
  @Input()
  public set errors(errors: ValidationErrors | null){
    this._errors = errors;
  }

  constructor(private el: ElementRef<HTMLElement>) {
    console.log('#constructor');
    this.htmlElement = el;
  }

  ngOnInit(): void {

  }

  setErrorMessage():void{

  }

  setTexto(text: string):void{
    if( !this.htmlElement ) return;
    this.htmlElement.nativeElement.innerHTML = text;
    // this.htmlElement.nativeElement.style.color
  }


}
