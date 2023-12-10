import { Pipe, PipeTransform } from '@angular/core';
import { format, fromUnixTime, getUnixTime, startOfDay, endOfDay, parseISO, startOfQuarter, endOfQuarter, startOfMonth, endOfMonth } from 'date-fns';
import { EDateTypeFormat } from '../models/enums/DateTypeFormat.enum';


@Pipe({
  name: 'customDatePipe'
})
export class CustomDatePipe implements PipeTransform {

  monthNumberToName(date: number): string {
    return format(new Date(date), 'MMMM');
  }
  quarterNumber(date: any): number {
    return Math.floor(new Date(date).getMonth() / 3) + 1;
  }
  getStartOfQuarterFromUnixToUnix(date: number): number {
    return getUnixTime(startOfQuarter(fromUnixTime(date)));
  }
  getEndOfQuarterFromUnixToUnix(date: number): number {
    return getUnixTime(endOfQuarter(fromUnixTime(date)));
  }
  getStartOfMonthFromUnixToUnix(date: number): number {
    return getUnixTime(startOfMonth(fromUnixTime(date)));
  }
  getEndOfMonthFromUnixToUnix(date: number): number {
    return getUnixTime(endOfMonth(fromUnixTime(date)));
  }
  transform(date: any, formatToApply: string = 'dd/MM/yyyy'): string {
    return format(fromUnixTime(date), formatToApply);
  }

  transformUnixToISO(date: any): string {
    return format(fromUnixTime(date), 'yyyy-MM-dd');
  }
  transformUnixToDate(date: any): Date {
    return fromUnixTime(date);
  }
  transformDateToUnix(date: Date = new Date()): number {
    const result: number = getUnixTime(date);
    // console.log(date + '   ' + result);
    return result;
  }
  transformNormalDateToISO(date: any, formatToApply: string = 'dd/MM/yyyy'): string {
    return format(new Date(date), formatToApply);
  }
  transformISOToUnix(date: any, dateInEndOfDay: boolean = false): number {
    let result = startOfDay(new Date(date)).getTime() / 1000;
    if (dateInEndOfDay) {
      result = endOfDay(new Date(date)).getTime() / 1000;
    }
    return Math.floor(result);
  }

  // TODO: mejorar customDate
  convertDateFormat(date: number | Date | string, formatType: EDateTypeFormat): number | Date | string {
    let convertedDate: number | Date | string = date;
    switch (formatType) {
      case EDateTypeFormat.ISO:
        if (typeof date === 'string') {
          console.info('Puedes ahorrarte este paso. Estas intentando convertir una fecha a un formato que ya tiene')
        } else if (typeof date === 'number') {
          convertedDate = format(fromUnixTime(date), 'yyyy-MM-dd');
        } else if (typeof date === 'object') {
          convertedDate = format(date, 'yyyy-MM-dd');
        } else {
          console.error('Formato de fecha introducida errorneo. Tiene que ser en formato unix, ISO o Date');
        }
        break;
      case EDateTypeFormat.DATE:
        if (typeof date === 'string') {
          convertedDate = parseISO(date);
        } else if (typeof date === 'number') {
          convertedDate = fromUnixTime(date);
        } else if (typeof date === 'object') {
          console.info('Puedes ahorrarte este paso. Estas intentando convertir una fecha a un formato que ya tiene')
        } else {
          console.error('Formato de fecha introducida errorneo. Tiene que ser en formato unix, ISO o Date');
        }
        break;
      case EDateTypeFormat.UNIX:
        if (typeof date === 'string') {
          convertedDate = (new Date(date)).getTime() / 1000;
        } else if (typeof date === 'object') {
          convertedDate = (date as Date).getTime() / 1000;
        } else if (typeof date === 'number') {
          console.info('Puedes ahorrarte este paso. Estas intentando convertir una fecha a un formato que ya tiene')
        } else {
          console.error('Formato de fecha introducida errorneo. Tiene que ser en formato unix, ISO o Date');
        }
        break;
    }
    return convertedDate;
  }
}
