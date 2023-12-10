import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'CustomTimePipe',
  standalone: true
})
export class CustomTimePipe implements PipeTransform {

  transform(time: string): unknown {
    if (time){
    return time.slice(0, 2) + ':' + time.slice(2, 4) + ':' + time.slice(4);
    }
    return time;
  }

}
