import { BreakpointObserver, Breakpoints } from "@angular/cdk/layout";
import { inject } from "@angular/core";


export abstract class AbstractResponsive{

  // ------ inject ------
  protected responsive = inject(BreakpointObserver);

  // ------ properties & signals ------
  protected isPhonePortrait = false;

  constructor(){
    this.initResponsive();
  }

  // ------ Métodos privados ------
  private initResponsive(){
    this.responsive.observe([Breakpoints.HandsetPortrait])
      .subscribe(result => {
        this.isPhonePortrait = false;

        if (result.matches) {
          this.isPhonePortrait = true;
        }
      });
  }
}
