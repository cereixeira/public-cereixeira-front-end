import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'simpleDatePipe',
  standalone: true
})
export class SimpleDatePipePipe implements PipeTransform {

  private readonly regex = new RegExp(/^\d{4}\s\d{2}$/, 'i'); // The "i" flag makes the regex case-insensitive

  transform(input:string|null|undefined): string {
    if(! input ) return '';

    if(this.regex.test(input)){
      input.match
      return this.simpleDateAsString(input);
    } else{
      console.log(`#SimpleDatePipePipe - no match - ${input}`);
      return input;
    }

  }

  private simpleDateAsString(input: string): string{

    let year:string = input.substring(0,4);
    let month:string = input.substring(5);

    let sMonth:string = '';
    switch(month){
      case '01' : sMonth = 'Ene.'; break;
      case '02' : sMonth = 'Feb.'; break;
      case '03' : sMonth = 'Mar.'; break;
      case '04' : sMonth = 'Abr.'; break;
      case '05' : sMonth = 'May.'; break;
      case '06' : sMonth = 'Jun.'; break;
      case '07' : sMonth = 'Jul.'; break;
      case '08' : sMonth = 'Ago.'; break;
      case '09' : sMonth = 'Sep.'; break;
      case '10' : sMonth = 'Oct.'; break;
      case '11' : sMonth = 'Nov.'; break;
      case '12' : sMonth = 'Dic.'; break;
      default: sMonth = month;
    }
    return sMonth + ' ' + year;
  }
}
