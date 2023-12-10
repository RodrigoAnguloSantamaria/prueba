import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IWorkingDay } from 'src/app/shared/models/interfaces/WorkingDay.interface';
const baseUrlPlane = 'http://172.22.24.7:8080/workingDay/plane/';
const baseUrlDB = 'http://172.22.24.7:8080/workingDay/';

@Injectable({
  providedIn: 'root'
})
export class WorkingDayService {

  constructor(private http: HttpClient) { }

  create(workingDay: IWorkingDay): Observable<any> {
    // workingDay.workingDate = startOfDay(workingDay.workingDate)
    return this.http.post(baseUrlPlane, workingDay);
  }

  update(id: string, data: IWorkingDay) {
    console.log(data);
    return this.http.put(baseUrlPlane + id, data);
  }

  delete(id: string, taksId: string) {
    return this.http.delete(baseUrlDB + id + "/" + taksId);
  }

  getAll(): Observable<any[]> {
    return this.http.get<any[]>(baseUrlPlane);
  }

  getUserWeeklyWorkingday(userId: string): Observable<any[]> {
    return this.http.get<any[]>(baseUrlDB + 'userWeeklyWorkingday/' + userId);
  }
}

