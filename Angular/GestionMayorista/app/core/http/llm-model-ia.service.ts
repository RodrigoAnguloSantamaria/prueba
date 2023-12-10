import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
// import { ProjectSelectorService } from './project-selector.service';

@Injectable({
  providedIn: 'root',
})
export class LlmModelIaService {
  private URL: string = environment.URL;
  private BACKEND_URL: string = environment.BACKEND_URL;
  getProjectAssistantResponse(
    query: string,
    stop$: Observable<void>
  ): Observable<string> {
    const url = `${this.URL}/predict_test`;

    const controller = new AbortController();

    return new Observable<string>((observer) => {

        fetch(this.BACKEND_URL, {
          method: 'post',
          body: query,
          signal: controller.signal,
          // headers: {
          //   'Project_id': "santander",
          // }
        })
          .then((response) => {
            const reader: ReadableStreamDefaultReader<string> = response
              .body!.pipeThrough(new TextDecoderStream())
              .getReader();

            const read = () => {
              reader.read().then(({ done, value }) => {
                if (done) {
                  observer.complete();
                  return;
                }
                let clean_value = value
                  .replace('\ndata: ', '')
                  .replace(/data:/g, '')
                  .replace('\n\n', '')
                  .replace('\r\n\r\n', '');
                observer.next(clean_value);
                read();
              });
            };
            read();
            stop$.subscribe(() => {
              try {
                //cancelar el reader antes de abortar para que no salga error en consola
                reader.cancel().then(() => {controller.abort();});
              } catch (error) {
                console.error('Error al desconectar:', error);
              }
              observer.complete();
              //console.log(observer);
            });
          })
          .catch((error) => {
            console.log("entro en errro");
            observer.error(error);
          });

    });
  }
}
