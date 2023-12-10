import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'thousandsPipe'
})
export class ThousandsPipe implements PipeTransform {

  transform(value: number | string): string {
    let result = '';
    // Si le pasamos un numero en formato number o string entonces le damos formato de miles
    //(Ej.: 1000000 pasaria a 1.000.000)
    if (typeof value === 'number') {
      result = value.toLocaleString();
    } else {
      const numberValue: number = parseFloat(value);
      if (!isNaN(numberValue) && isFinite(numberValue)) {
        result = numberValue.toLocaleString();
      } else {
        result = value;
      }
    }
    return result;
  }

}
