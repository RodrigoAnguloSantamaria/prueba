import { id } from '@swimlane/ngx-charts';
export interface IMessageNomarca {
  id?: string;
  fecha: number;
  mensaje: string;
}
export interface IEventosNomarca {
  id?: string;
  fecha: number;
  evento: string;
  cgasto: string;
  numexpediente: string;
  lote: number;
  titulo: string;
}
export interface IExpedientesNomarca {
  id?:string
  numexpediente:string
  lote:number
  texto:string
  rc:number
  asignado:number
  dispuesto:number
  ok:number
  tipopresupuesto:string
  procedimiento:string
  cgasto:string
  situacion:string

  servicio:string
  programa:string
  year:number
  duracion:string
  grupo:string
  fechaAlta:number | string 
  fechaLanzado:number | string // SE USA COMO FECHA LANZADO EN EL COMPONENTE

  fechaInicioContrato:number | string 
  fechaFinContrato:number | string
  observaciones:string
  tramites?:ITramitesNomarca[]
  lotes?:ILoteNomarca[]  
  
}
export interface IAnticiposNomarca {
  id?: string;
  year: number;
  concepto: string;
  importe: number;
  fecha_autorizacion: number;
  fecha_presupuesto: number;
  fecha_envio: number;
  fecha_factura: number;
  numero_factura: number;
  empresa: string;
  economica: number;
  provincia: string;
  localidad: string;
  observaciones: string;
  
}

export interface IEmpresasNomarca {
  cif: string;
  empresa: string;
  domicilio: string;
  telefono: number;
  centro_gasto: string;
}

export interface IUserNomarca {
  usuario:string
  nombre: string;
  destinado: string;
  cgasto: string;
  categoria: string;
  telefono: number;
  correo: string;
}
export interface ITramitesNomarca {
  fechatramite: number | string;
  observacionestramite: string;
}
export interface ILoteNomarca{
  numlote:number;
  material:string;
  unidades:number;
  importe:number;
  economica:string;
  estado:string;
  prorroga:string;
  empresa:string;
  familia:string;
  destino:string;
  inicioLote:number | string;
  finLote:number | string;
  observaciones:string;

}

export interface ICentroNomarca {
  id:string;
  nombre: string;
  telefono: number;
  correo: string;
}

export interface IConsultNomarca {
  year: number;
  expediente: string;
  centroGasto: string;
  titulo: string;
  vinculante: number;
  economica: number;
  rcYear: number;
  rcDeslizado: number;
  aDeslizado: number;
  dDeslizado: number;
  ok: number;
  rcNegativo: number;
  sinJustificar: number;
}
