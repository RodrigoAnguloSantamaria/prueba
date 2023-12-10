import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CallsHttpService {
  CALL_URL: string = environment.CALLS_URL;
  constructor(private http: HttpClient) { }

  sendCallsFiles(data: FormData): Observable<HttpResponse<Blob | string>> {
    return this.http.post(this.CALL_URL, data, { observe: 'response', responseType: 'blob' });
  }

  getMultipleFiles() {
    return this.http.get(`${this.CALL_URL}/files`, { responseType: 'blob' });
  }

  sendFilesToConvert(data: FormData) {
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'multipart/form-data');
    return this.http.post(`${this.CALL_URL}/files`, data, { headers });
  }

  getConvertedFiles() {
    return this.http.get(`${this.CALL_URL}/allConvertedFiles`);
  }

  getSourceFiles() {
    return this.http.get(`${this.CALL_URL}/allFiles`);
  }

  getConvertFile(body: string | string[]) {
    
    if (typeof body === 'string') {
       body = JSON.stringify([body]);
      
    }
   
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(`${this.CALL_URL}/convert/`, body, { headers: headers, responseType: 'json' });
  }

  downloadZipFile(filesDownload: string[]) {
    return this.http.post(`${this.CALL_URL}/zipfiles`, filesDownload, { responseType: 'text' });
  }

  getconvertAllFiles() {
    return this.http.get(`${this.CALL_URL}/convertAll`);
  }

}
