import { Observable, Subject, tap } from 'rxjs';
import { id } from '@swimlane/ngx-charts';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Synchro } from '../../models/interfaces/Synchro';
import { th } from 'date-fns/locale';

@Injectable({
  providedIn: 'root'
})
export class SynchroService {
  apiUrl =environment.NOMARCA_URL;
  private synchroDataSubject = new Subject<Synchro[]>();

constructor(private http: HttpClient) { }

getSynchroData(): Observable<any> {
  // fetch('http://localhost:3000/synchro')
  // .then(response => response.json())
  // .then(data => {
  //   console.log(data);
  // });
  return this.http.get<Synchro[]>(`${this.apiUrl}/getdata`)
  .pipe(tap(data => this.synchroDataSubject.next(data)));

}
getSynchroDataObservable(): Observable<Synchro[]> {
  return this.synchroDataSubject.asObservable();
}

prueba(mail:string): Observable<any> {
 return this.http.get(`${this.apiUrl}/auto/`+mail);
}
}
