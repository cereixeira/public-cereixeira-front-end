import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'arrayToString',
  standalone: true
})
export class ArrayToStringPipe implements PipeTransform {

  transform(input:Array<any>|null|undefined, sep = ','): string {

    return input ? input.join(sep) : '';
  }

}
