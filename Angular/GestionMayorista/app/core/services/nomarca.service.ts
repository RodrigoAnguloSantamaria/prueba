import { id } from '@swimlane/ngx-charts';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IAnticiposNomarca, IExpedientesNomarca } from 'src/app/shared/models/interfaces/Table.interface';
import { environment } from 'src/environments/environment';
import {MatTabsModule} from '@angular/material/tabs';
import { now } from 'd3';
import { DatePipe } from '@angular/common';

const noMarcaUrl = environment.noMarcaUrl;
@Injectable({
  providedIn: 'root'
})



export class NomarcaService {

  public _expediente!: IExpedientesNomarca;
  public _anticipo!: IAnticiposNomarca;
 

  constructor(private http: HttpClient) {
    this.expedienteInitialValues();
   }

  public setExpediente(expediente: IExpedientesNomarca) {
    this._expediente = expediente;
  //  console.log(this._expediente);
  }
  public serAnticipo(anticipo: IAnticiposNomarca) {
    this._anticipo = anticipo;
  }
  public expedienteInitialValues(){
    const currentDate = Date.now();
    
    this._expediente = {
      numexpediente: '',
      lote: 0,
      texto: '',
      rc: 0,
      asignado: 0,
      dispuesto: 0,
      ok: 0,
      tipopresupuesto: '',
      procedimiento: '',
      cgasto: '',
      situacion: '',
   
      servicio: '',
      programa: '',
      year: 2023,
      duracion: '',
      grupo: '',
      fechaAlta: '',
      fechaLanzado: Math.floor(Date.now() / 1000),  
      fechaInicioContrato: '',
      fechaFinContrato: '',
      observaciones: ''
    };
  }
  public anticipoInitialValues(){
    const currentDate = Date.now();
    
    this._anticipo = {
     
      year: 2023,
      concepto: '',
      importe: 0,
      fecha_autorizacion: 0,
      fecha_presupuesto: 0,
      fecha_envio: 0,
      fecha_factura: 0,
      numero_factura: 0,
      empresa: '',
      economica: 0,
      provincia: '',
      localidad: '',
      observaciones: ''
      
    };
  }
  public getAllEvents() {
    return this.http.get(noMarcaUrl + 'eventos');
  }
  public getAllMessages() {
    return this.http.get(noMarcaUrl + 'mensajes');
  }

  //EXPEDIENTES
  public getAllFiles() {
    return this.http.get(noMarcaUrl + 'expedientes');
  }
  public getFileById(numexpediente: string):Observable<any>{
    let body={"numexpediente":numexpediente};
    return this.http.post(noMarcaUrl + 'getexpediente/', body);
  }
  create(fileForm:IExpedientesNomarca): Observable<any> {
    return this.http.post(noMarcaUrl + 'expediente', fileForm);
  }
  createCash(fileForm:IAnticiposNomarca): Observable<any> {
    return this.http.post(noMarcaUrl + 'anticipo', fileForm);
  }

  update(id: string, data: IExpedientesNomarca) {
    console.log(data);
    return this.http.put(noMarcaUrl + id, data);
  }

  delete(id: string) {
    return this.http.delete(noMarcaUrl + 'expediente/' + id, { responseType: 'text' });
  }

  //ANTICIPOS
  public getAllCash(){
    return this.http.get(noMarcaUrl + 'anticipos');
  }
  deleteCash(id: string) {
    return this.http.delete(noMarcaUrl + 'anticipos/' + id, { responseType: 'text' });
  }
  public getCashById(id: string):Observable<any>{
    return this.http.get(noMarcaUrl + 'anticipo/' + id);
  }


  //EMPRESAS

  public getAllCompany(){
    return this.http.get(noMarcaUrl + 'empresas');
  }
  deleteCompany(id: string) {
    return this.http.delete(noMarcaUrl + 'empresas/' + id, { responseType: 'text' });
  }

   //USERS

   public getAllUser(){
    return this.http.get(noMarcaUrl + 'usuarios');
  }
  deleteUser(id: string) {
    return this.http.delete(noMarcaUrl + 'usuarios/' + id, { responseType: 'text' });
  }

    //CENTROS

    public getAllCenter(){
      return this.http.get(noMarcaUrl + 'centros');
    }

    getAllCentersByType(type: string): Observable<any> {
      return this.http.get(`${noMarcaUrl}centros?type=${type}`);
    }

    deleteCenter(id: string) {
      return this.http.delete(noMarcaUrl + 'centros/' + id, { responseType: 'text' });
    }

    //CONSULTAS
    //CENTROS

    public getAllConsult(){
      return this.http.get(noMarcaUrl + 'consultas');
    }
}
