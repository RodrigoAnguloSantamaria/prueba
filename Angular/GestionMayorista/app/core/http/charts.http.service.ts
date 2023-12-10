import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

const baseUrlChart = 'http://172.22.24.7:8080/chart';

@Injectable({
  providedIn: 'root'
})
export class ChartsHttpService {

  constructor(private http: HttpClient) {

  }
  getAllOnSimpleChartFormat(name: string, value: string, startDate: number, endDate: number): Observable<any[]> {
    console.log('Simple chart service: ' + JSON.stringify({ name, value, startDate, endDate }));
    return this.http.get<any[]>(baseUrlChart + "/simple", {
      params: {
        name: name,
        value: value,
        start: startDate,
        end: endDate
      }
    });
  }
  getAllOnSeriesChartFormat(name: string, value: string, startDate: number, endDate: number): Observable<any[]> {
    console.log('Series chart service: ' + JSON.stringify({ name, value, startDate, endDate }));

    return this.http.get<any[]>(baseUrlChart + "/series", {
      params: {
        name: name,
        value: value,
        start: startDate,
        end: endDate
      }
    });
  }


  getTotalProjectsInfo(startDate: number, endDate: number): Observable<any[]> {
    // console.log('Series chart service: ' + startDate + ' ' + endDate);
    return this.http.get<any[]>(baseUrlChart + "/realProjectsInfo", {
      params: {
        start: startDate,
        end: endDate
      }
    });
  }


  // ************** Funciones para detailedInfo **************

  getAllDetailedProjectInfoGroupByDates(projectId: string, name: string, value: string, startDate: number, endDate: number): Observable<any[]> {
    console.log('Series chart service: ' + JSON.stringify({ projectId, name, value, startDate, endDate }));

    return this.http.get<any[]>(baseUrlChart + "/detailedInfo/groupByDates", {
      params: {
        projectId: projectId,
        name: name,
        value: value,
        start: startDate,
        end: endDate
      }
    });
  }

  getTotalInfoGroupByTaskId(id: string, startDate: number, endDate: number): Observable<any[]> {
    console.log('Series chart service: ' + JSON.stringify({ id, startDate, endDate }));
    return this.http.get<any[]>(baseUrlChart + "/detailedInfo/groupByTaskId", {
      params: {
        id: id,
        start: startDate,
        end: endDate
      }
    });
  }
}
