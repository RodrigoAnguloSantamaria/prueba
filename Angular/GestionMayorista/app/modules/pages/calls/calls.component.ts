import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Component, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

import { CallsHttpService } from 'src/app/core/http/calls.http.service';
import * as XLSX from 'xlsx';
import { environment } from 'src/environments/environment';

import { ShowAlertService } from 'src/app/shared/components/custom-alert/show-alert.service';
import { ConfirmDialogComponent } from 'src/app/shared/components/confirm-dialog/confirm-dialog.component';
import { ShowConfirmDialogService } from 'src/app/shared/components/confirm-dialog/show-confirm-dialog.service';
import { IConfirmDialogData } from 'src/app/shared/models/interfaces/ConfirmDialogData.interface';
import { ar } from 'date-fns/locale';

@Component({
  selector: 'app-calls',
  templateUrl: './calls.component.html',
  styleUrls: ['./calls.component.css'],
  providers: [],
})
export class CallsComponent implements OnInit {


  selectedFile: File | null = null;
  receivedFile: any;
  fileName = 'nombre';
  validExt: string[] = ['.xlsx', '.xls', '.csv'];
  extensionError: boolean = false;
  sizeError: boolean = false;

  excelData: any[] | undefined; // Para almacenar los datos del archivo Excel
  excelHtml: string | undefined; // Para almacenar la representación HTML
  blobUrl: any;
  data: any;
  archivoNombre = '';
  fechaHoraConexion = '';
  archivoSize = 0;
  archivoEnlace = '';
  archivos: any[] = [];
  fileUrl: string = environment.CALLS_URL + '/file/';
  expression: boolean = false;
  conversationMessage: string = '';
  conversationOk: boolean = false;
  filesDownload: string[] = [];
  filesConvert: string[] = [];
 

  constructor(
    public dialog: MatDialog,
    private callsService: CallsHttpService,
    private sanitizer: DomSanitizer,
    private showAlertService: ShowAlertService,
    private confirmService: ShowConfirmDialogService
  ) { }

  ngOnInit(): void {
    this.filesConvert = [];
    this.filesDownload = [];

  }
  uploadFile() {
    if (this.selectedFile) {
      const formData = new FormData();
      formData.append('file', this.selectedFile, this.selectedFile.name);
      //añadir un apend para cada parametro que se quiera enviar resto datos operacion y nombre
      // Reemplaza la URL con la del servidor donde deseas cargar el archivo.
      this.callsService.sendCallsFiles(formData).subscribe(
        (response) => {
          if (response.status == 200) {
            // Respuesta exitosa (responseType: blob)
            const blobResponse: any = response.body;
            // Crea una URL de objeto de datos (data URL) a partir del Blob
            if (blobResponse) {
              this.blobUrl = window.URL.createObjectURL(blobResponse);
            }

            fetch(this.blobUrl)
              .then((response) => response.blob())
              .then((blob) => {
                return new Promise((resolve, reject) => {
                  const reader = new FileReader();
                  reader.onload = (event) => {
                    if (event.target) {
                      resolve(event.target.result);
                    } else {
                      reject(new Error('Event target is null'));
                    }
                  };
                  reader.readAsArrayBuffer(blob);
                });
              })
              .then((arrayBuffer: unknown) => {
                // Convierte el array buffer a una representación HTML
                const data = new Uint8Array(arrayBuffer as ArrayBuffer);
                const workbook = XLSX.read(data.buffer as ArrayBuffer, {
                  type: 'array',
                });
                const worksheet = workbook.Sheets[workbook.SheetNames[0]];

                this.excelHtml = XLSX.utils.sheet_to_html(worksheet);
                // Aplica estilos al HTML generado
                this.excelHtml = this.excelHtml.replace(
                  /<table/g,
                  '<table style="border-collapse: collapse; width: 100%;"'
                );
                this.excelHtml = this.excelHtml.replace(
                  /<td/g,
                  '<td style="border: 1px solid #ddd; padding: 8px;"'
                );
                this.excelHtml = this.excelHtml.replace(
                  /<th/g,
                  '<th style="border: 1px solid #ddd; padding: 8px; background-color: #f2f2f2;"'
                );

                // Por ejemplo, aquí mostramos la representación en un div
                document.getElementById('excel-container')!.innerHTML =
                  this.excelHtml;
              });
          }
        },
        (error) => {
          if (error instanceof HttpErrorResponse) {
            console.log(
              'Error en el formato del archivo o tamaño superior a 2 MB.'
            );
          } else {
            console.log('Error desconocido.');
          }
        }
      );
    }
  }

  downloadFile(filename: string) {
    const a = document.createElement('a');
    a.href = this.fileUrl + filename;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    // this.receivedFile = this.sanitizer.bypassSecurityTrustResourceUrl(this.blobUrl);
  }

  handleFile(e: any) {
    this.selectedFile = e.target.files![0];
    this.isValidFile();
  }
  isValidFile() {
    //SETEA VARIABLES DE ERROR A VALORES INCIALES (FALSE)
    this.extensionError = false;
    this.sizeError = false;
    if (this.selectedFile) {
      //OBTIENE LA EXTENSION DEL ARCHIVO
      let extensionFile = this.selectedFile.name.substring(
        this.selectedFile.name.lastIndexOf('.')
      );
      // COMPRUEBA QUE EXTENSION SEA VALIDA SEGUN ARRAY DECLARADO EN LA CLASE
      if (extensionFile && this.validExt.includes(extensionFile)) {
        // COMPRUEBA TAMAÑO DE ARCHIVO SI EXTENSION ES VALIDA
        if (this.selectedFile.size < 2000000) {
          this.extensionError = false;
          this.sizeError = false;
        } else {
          // ERROR DE TAMAÑO
          this.sizeError = true;
        }
      } else {
        // ERROR DE EXTENSION
        this.extensionError = true;
      }
    }
  }

  // loadMultipleFiles() {
  //   //obtengo archivos de carpeta
  //   this.callsService.getMultipleFiles().subscribe((data) => {
  //     this.readFileDataFromBlob(data);
  //   });

  // }
  // private readFileDataFromBlob(blob: Blob) {
  //   const reader = new FileReader();

  //   reader.onload = () => {
  //     const arrayBuffer = reader.result as ArrayBuffer;

  //     this.unzipZipFile(arrayBuffer);
  //   };

  //   // Read the Blob as an ArrayBuffer
  //   reader.readAsArrayBuffer(blob);
  // }

  // private async unzipZipFile(arrayBuffer: ArrayBuffer) {
  //   const jszip = new JSZip();
  //   const formData = new FormData();

  //   try {
  //     let zip = await jszip.loadAsync(arrayBuffer);

  //     // Get the number of files in the zip archive
  //     let numFiles = Object.entries(zip.files).length;

  //     let count = 0;

  //     zip.forEach(async (relativePath, file) => {

  //       const fileContent = await file.async('arraybuffer'); // You can choose the appropriate format (e.g., 'text' for text files)
  //       //console.log('Appending file:', relativePath);
  //       //console.log("filecontent: " + fileContent);
  //       formData.append('files', new Blob([fileContent], { type: 'application/octet-stream' }), relativePath);

  //       count++;
  //       //console.log(numFiles + " --- " + count);

  //       if (count == numFiles) {
  //         this.sendFilesToConvert(formData);

  //       }
  //     });
  //   } catch (error) {
  //     console.error('Error unzipping the file:', error);
  //   }

  // }

  // sendFilesToConvert(data: FormData) {
  //   //hago el post al servidor
  //   data.forEach((value, key) => {
  //     console.log(key, value);
  //   });
  //   let newData = data;
  //   this.callsService.sendFilesToConvert(newData).subscribe((data) => {
  //     console.log(data);
  //   });
  // }

  sendFilesToConvert(data: FormData) {
    // Limpiar los valores antes de enviar una nueva solicitud
    this.archivos = [];

    data.getAll('allFiles').forEach((file: any) => {
      const archivo = {
        nombre: file.name,
        // fechaModificacion: file.lastModifiedDate,
        // size: file.size,
        enlace: this.crearEnlaceDescarga('file'),
      };

      this.archivos.push(archivo);
    });

    // Envía los archivos al servidor
    this.callsService.sendFilesToConvert(data).subscribe(
      (response: any) => {
        console.log('Respuesta del servidor:', response);
      },
      (error) => {
        console.error('Error en la solicitud al servidor:', error);
      }
    );
  }

  crearEnlaceDescarga(file: any): SafeResourceUrl {
    const blob = new Blob([file], { type: file.type });
    return this.sanitizer.bypassSecurityTrustResourceUrl(
      window.URL.createObjectURL(blob)
    );
  }

  getSizeInKB(sizeInBytes: number): number {
    return Math.round(sizeInBytes / 1024); // Divide por 1024 para obtener KB y redondea el resultado
  }
  ////////////////////////////////NUEVO//////////////////////////////////////////////////////
  loadMultipleFiles() {
    this.conversationOk = false;
    this.archivos = [];
    this.expression = false;
    this.filesConvert = [];
    this.filesDownload = [];
   
    this.callsService.getSourceFiles().subscribe({
      error: (error) => { 
        this.showAlertService.showCustomAlert(
          error,
          'error',
          5,
          'top',
          'center'
        );
      },
      next: (data: any) => {
        // Mapear los datos para mostrar solo los que no empiezan con "C"
        this.archivos = data.filter(
          (archivo: string) => !archivo.startsWith('C')
        );
        this.checkEmptyData(this.archivos);
      },
    });
  }

  loadConvertedFiles() {
    this.conversationOk = false;
    this.archivos = [];
    this.expression = true;
    this.filesConvert = [];
    this.filesDownload = [];
   
    this.callsService.getConvertedFiles().subscribe({
      next: (data: any) => {
        this.archivos = data.filter((archivo: string) => {
          let ext = archivo.substring(archivo.lastIndexOf('.') + 1);
          return ext != 'zip';
        }
        );
        // ORDENA ARRAY POR FECHA DE MAS NUEVO A MAS VIEJO
        this.archivos = this.archivos.sort((b, a) => {
          const dateA: any = this.extractDate(a);
          const dateB: any = this.extractDate(b);
          return dateA - dateB;
        });
        this.checkEmptyData(this.archivos);
      },
      error: (error) => {
        this.showAlertService.showCustomAlert(
          error,
          'error',
          5,
          'top',
          'center'
        );
      },
    });
  }

  // ESTE METODO TRANSFORMA EL STRING DEL NOMBRE DEL ARCHIVO CONVERTIDO A DATE
  extractDate(fileName: string): Date {
    const dateString = fileName.split('_')[1].substring(0, 15);

    return new Date(
      parseInt(dateString.substring(4, 8)), // Año
      parseInt(dateString.substring(2, 4)) - 1, // Mes (restar 1 ya que en JavaScript los meses van de 0 a 11)
      parseInt(dateString.substring(0, 2)), // Día
      parseInt(dateString.substring(9, 11)), // Hora
      parseInt(dateString.substring(11, 13)), // Minuto
      parseInt(dateString.substring(13, 15)) // Segundos
    );
  }

  convertOneFile(archivo: string | string[]) {
   
    let data: IConfirmDialogData = { type: 'confirm', title: 'Convertir archivo  ' + archivo + '?' };
    this.confirmService.show(data).subscribe((result) => {
      if (result) {

        this.callsService.getConvertFile(archivo).subscribe({
          next: (data: any) => {
            data = data.toString().replace(/,/g, '\n');
            this.showAlertService.showCustomAlert(
              'Nuevo archivo convertido: ' + data,
              'success',
              5,
              'top',
              'center'
            );
            this.loadConvertedFiles();

          },
          error: (error) => {

            this.showAlertService.showCustomAlert(
              error,
              'error',
              5,
              'top',
              'center'
            );
          },
        });
      }
    });

  }

  convertAllFiles() {
    let data: IConfirmDialogData = { type: 'confirm', title: 'Convertir todos los archivos?' };
    this.confirmService.show(data).subscribe((result) => {
      if (result) {
        this.callsService.getconvertAllFiles().subscribe({
          next: (data: any) => {

            data = data.toString().replace(/,/g, '\n');


            this.showAlertService.showCustomAlert(
              'Archivos convertidos: ' + data,
              'success',
              8,
              'top',
              'center'
            );
            this.loadConvertedFiles();

          },
          error: (error) => {
            this.showAlertService.showCustomAlert(
              error,
              'error',
              5,
              'top',
              'center'
            );
          },
        });
      }

    });

  }
  convertNFiles() {
    this.callsService.getConvertFile(this.filesDownload).subscribe({
      next: (data: any) => {
        console.log(data);
        this.showAlertService.showCustomAlert(
          'Nuevo arhivo convertido: ' + data,
          'success',
          5,
          'top',
          'center'
        );
        this.loadConvertedFiles();

      }

    });
  }
  downloadNFiles() {
    this.callsService.downloadZipFile(this.filesDownload).subscribe((data: any) => {
      
      this.downloadFile(data);
    });
    this.loadConvertedFiles();
  }
  checkEmptyData(data: any) {
    if (data.length == 0) {
      this.showAlertService.showCustomAlert(
        'No hay archivos',
        'error',
        5,
        'top',
        'center'
      );
    }
  }
  changeSelectionDownload(e: any) {

    if (this.filesDownload.includes(e.target.value)) {
      this.filesDownload = this.filesDownload.filter((file) => file != e.target.value);


    }
    else {
      this.filesDownload.push(e.target.value);
    }




  }
  changeSelectionConvert(e: any) {

    if (this.filesConvert.includes(e.target.value)) {
      this.filesConvert = this.filesConvert.filter((file) => file != e.target.value);


    }
    else {
      this.filesConvert.push(e.target.value);
    }




  }
  selectAllChaeckboxes(origen:string) {

    document.querySelectorAll('input[type="checkbox"]').forEach((element) => {
      const inputElement = element as HTMLInputElement;
    
        inputElement.checked = !inputElement.checked;
    
      if (inputElement.checked) {
        if (origen == 'convertir') {
          this.filesConvert.push(inputElement.value);
        }
        this.filesDownload.push(inputElement.value);
       
      }
      else {
        if (origen == 'convertir') {
          this.filesConvert = this.filesConvert.filter((file) => file != inputElement.value);
        }
        this.filesDownload = this.filesDownload.filter((file) => file != inputElement.value);
        
      }



    });
   
  }
}
