
import { Pipe, PipeTransform } from "@angular/core";


@Pipe({
  name: 'CustomTimePipe',
  standalone: true
})
export class CustomTimePipe implements PipeTransform {

  transform(time: string): string {
    if (typeof time === 'string' && time.length === 6) {
      return `${time.slice(0, 2)}:${time.slice(2, 4)}:${time.slice(4)}`;
    }
    return time;
  }
}
