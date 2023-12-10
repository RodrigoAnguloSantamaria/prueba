import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EnvironmentInjector, Injectable } from '@angular/core';
import { Observable, catchError, map, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ChangeCronService {
  apiUrl = environment.CALLS_URL + '/updateCron';
  baseUrl = environment.CALLS_URL;

  constructor(private http: HttpClient) {}

  getCronExpression(): Observable<string> {
    return this.http.get<{ cronExpression: string }>(this.apiUrl)
      .pipe(
        map(response => response.cronExpression),
        catchError(this.handleError)
      );
  }

  updateCronExpression(newCronExpression: any) {
    //const headers = new HttpHeaders( { 'Content-Type': 'text/plain' });
   // return this.http.post<string>(this.apiUrl, newCronExpression);
    return this.http.post(this.apiUrl, newCronExpression, { responseType: 'text' });
     
  }

  private handleError(error: any): Observable<never> {
    console.error('Error occurred:', error);
    return throwError('Error occurred while updating cron expression.');
  }
  getCronByTask(task: string) {
    return this.http.get(this.baseUrl + '/cron/'+task,{ responseType: 'text' });  
  }

}
