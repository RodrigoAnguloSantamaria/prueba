import { Injectable } from '@angular/core';
import { fromUnixTime, getUnixTime } from 'date-fns';
import { BehaviorSubject, Observable} from 'rxjs';
import { IRangeDatesUnix } from 'src/app/shared/models/interfaces/RangeDatesUnix.interface';

@Injectable({
  providedIn: 'root'
})
export class DateFilterService {

  private _rangeDates$: BehaviorSubject<IRangeDatesUnix> = new BehaviorSubject<IRangeDatesUnix>({
    startDate : 1546297200, // 2019-01-01 cuando se crearon los datos
    endDate: getUnixTime(new Date())
  });

  getRangeDatesObservable(): Observable<IRangeDatesUnix>{
    return this._rangeDates$.asObservable();
  }

  setRangeDatesObservable(data: IRangeDatesUnix){
    // Para omitir llamadas repetidas
    if(!(data.startDate === this._rangeDates$.getValue().startDate && data.endDate === this._rangeDates$.getValue().endDate)){
      console.log(fromUnixTime(data.startDate));
      console.log(fromUnixTime(data.endDate));
      this._rangeDates$.next(data);
    }

  }

}
