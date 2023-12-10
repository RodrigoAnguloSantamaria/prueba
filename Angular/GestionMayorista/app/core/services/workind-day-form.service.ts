import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { EWorkinDayFormAction } from 'src/app/shared/models/enums/WorkinDayFormAction.enum';
import { IWorkingDay } from 'src/app/shared/models/interfaces/WorkingDay.interface';

@Injectable({
  providedIn: 'root'
})
export class WorkindDayFormService {
  private _workingDayDataForm$: BehaviorSubject<IWorkingDay> = new BehaviorSubject<IWorkingDay>(
    {
      id: "",
      workingDate: Math.floor(Date.now() / 1000),
      projectId: "",
      userId: "U001",
      taskTypeId: "",
      timeSpent: 0.0,
      taskCost: 0.0, // TODO: manejarlo en el backend
    }
  );
  private _workinDayFormAction$: BehaviorSubject<EWorkinDayFormAction> = new BehaviorSubject<EWorkinDayFormAction>(
    EWorkinDayFormAction.ADD
  );

  getWorkingDayDataFormObservable(): Observable<IWorkingDay> {
    return this._workingDayDataForm$.asObservable();
  }

  setWorkingDayDataFormObservable(data: IWorkingDay) {
    console.log(data);

    this._workingDayDataForm$.next(data);
  }
  getWorkinDayFormActionObservable(): Observable<EWorkinDayFormAction> {
    return this._workinDayFormAction$.asObservable();
  }

  setWorkinDayFormActionObservable(data: EWorkinDayFormAction) {
    this._workinDayFormAction$.next(data);
  }

}
