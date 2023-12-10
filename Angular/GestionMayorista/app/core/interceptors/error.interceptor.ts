import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
  HttpResponse
} from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor() { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    return next.handle(request)
    // .pipe(
    //   catchError((error: HttpErrorResponse): Observable<HttpResponse<any>> => {
    //     console.log(error);
    //     if (error instanceof HttpErrorResponse) {
    //       if (error.status === 0) {
    //         return throwError("Error de conexión.");
    //       }
    //       if (error.status === 404 || error.status === 403 || error.status === 400 || error.status === 501 || error.status == 500 || error.status == 504) {
    //         //console.log(error);
    //         return throwError(error.error);
    //       }
    //       if (error.status === 401) {
    //         return throwError("No autorizado.");
    //       }
    //     }
    //     return throwError(error);

    //   })


    // )

  }
}
