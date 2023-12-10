import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Form, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { da } from 'date-fns/locale';
import { forEach } from 'jszip';
import { NomarcaService } from 'src/app/core/services/nomarca.service';
import { IAnualData, ShowConfirmDialogService } from 'src/app/shared/components/confirm-dialog/show-confirm-dialog.service';
import { CustomDatePipe } from 'src/app/shared/pipes/customDate.pipe';
import { NewLoteComponent } from './new-lote/new-lote.component';

@Component({
  selector: 'app-file-form-day',
  templateUrl: './file-form.component.html',
  styleUrls: ['./file-form.component.css'],
  providers: [DatePipe, CustomDatePipe]
})
// TODO: se puede optimizar el tema de editar y añadir workingDays
export class FileFormComponent implements OnInit {
  fileForm!: FormGroup;
  isSubmitted = false;
  tipoFicha: string = 'nueva'
  tiposPresupuesto = ['Ordinario', 'Citco', 'Extraordinario', 'Campo de Gibraltar'];
  procedimientos = ['PAS', 'CM', 'NSP', 'PA', 'PASES'];
  centrosGasto = ['AQ', 'SU', 'CO', 'SE', 'SC', 'VE', 'IN', 'AU'];
  situaciones = ['En tramite', 'En estudio', 'En espera', 'En aprobacion', 'Aprobado', 'Rechazado', 'Enviado', 'Recibido', 'Finalizado'];
  servicios = ['Servicio 1', 'Servicio 2', 'Servicio 3', 'Servicio 4', 'Servicio 5', 'Servicio 6', 'Servicio 7', 'Servicio 8', 'Servicio 9', 'Servicio 10'];
  programas = ['Programa 1', 'Programa 2', 'Programa 3', 'Programa 4', 'Programa 5', 'Programa 6', 'Programa 7', 'Programa 8', 'Programa 9', 'Programa 10'];
  duraciones = ['1 año', '2 años', '3 años', '4 años', '5 años', '6 años', '7 años', '8 años', '9 años', '10 años'];
  grupos = ['Grupo 1', 'Grupo 2', 'Grupo 3', 'Grupo 4', 'Grupo 5', 'Grupo 6', 'Grupo 7', 'Grupo 8', 'Grupo 9', 'Grupo 10'];
  empresas = ['Empresa 1', 'Empresa 2', 'Empresa 3', 'Empresa 4', 'Empresa 5', 'Empresa 6', 'Empresa 7', 'Empresa 8', 'Empresa 9', 'Empresa 10'];
  familias = ['Familia 1', 'Familia 2', 'Familia 3', 'Familia 4', 'Familia 5', 'Familia 6', 'Familia 7', 'Familia 8', 'Familia 9', 'Familia 10'];
  destinos = ['Destino 1', 'Destino 2', 'Destino 3', 'Destino 4', 'Destino 5', 'Destino 6', 'Destino 7', 'Destino 8', 'Destino 9', 'Destino 10'];

  constructor(private fb: FormBuilder, public nomarcaService: NomarcaService, private datePipe: DatePipe, private customDatePipe: CustomDatePipe, private showConfirmDialog: ShowConfirmDialogService) {

    const tramitesArrayData: FormGroup[] = nomarcaService._expediente.tramites?.map(tramite => {
      return this.fb.group({
        fechatramite: [tramite?.fechatramite ? customDatePipe.transformUnixToISO(tramite?.fechatramite) : 0],
        observacionestramite: [tramite?.observacionestramite || '']
      });
    }) || [];
    const LotesArrayData: FormGroup[] = nomarcaService._expediente.lotes?.map(lote => {
      return this.fb.group({
        numlote:[lote?.numlote || 0],
        material:[lote?.material || ''],
        unidades:[lote?.unidades || 0],
        importe:[lote?.importe || 0],
        economica:[lote?.economica || ''],
        estado:[lote?.estado || ''],
        prorroga:[lote?.prorroga || ''],
        empresa:[lote?.empresa || ''],
        familia:[lote?.familia || ''],
        destino:[lote?.destino || ''],
        inicioLote:[lote?.inicioLote ? customDatePipe.transformUnixToISO(lote?.inicioLote) : 0],
        finLote:[lote?.finLote ? customDatePipe.transformUnixToISO(lote?.finLote) : 0],
        observaciones:[lote?.observaciones || '']
       
      });
    }) || [];
    this.fileForm = this.fb.group({
      id: [nomarcaService._expediente.id],
      numexpediente: [nomarcaService._expediente.numexpediente, [Validators.required, Validators.minLength(5)]],
      lote: [nomarcaService._expediente.lote],
      texto: [nomarcaService._expediente.texto, [Validators.required, Validators.minLength(10)]],
      rc: [nomarcaService._expediente.rc],
      asignado: [nomarcaService._expediente.asignado],
      dispuesto: [nomarcaService._expediente.dispuesto],
      ok: [nomarcaService._expediente.ok],
      tipopresupuesto: [nomarcaService._expediente.tipopresupuesto],
      procedimiento: [nomarcaService._expediente.procedimiento],
      cgasto: [nomarcaService._expediente.cgasto],
      situacion: [nomarcaService._expediente.situacion, [Validators.required]],
      fechaLanzado: [customDatePipe.transformUnixToISO(nomarcaService._expediente.fechaLanzado)],
      servicio: [nomarcaService._expediente.servicio],
      programa: [nomarcaService._expediente.programa],
      year: [nomarcaService._expediente.year],
      duracion: [nomarcaService._expediente.duracion],
      grupo: [nomarcaService._expediente.grupo],
      fechaAlta: [nomarcaService._expediente.fechaAlta ? customDatePipe.transformUnixToISO(nomarcaService._expediente.fechaAlta) : 0],
      fechaInicioContrato: [nomarcaService._expediente.fechaInicioContrato  ?
        customDatePipe.transformUnixToISO(nomarcaService._expediente.fechaInicioContrato) : 0],
      fechaFinContrato: [nomarcaService._expediente.fechaFinContrato  ?
        customDatePipe.transformUnixToISO(nomarcaService._expediente.fechaFinContrato) : 0],
      observaciones: [nomarcaService._expediente.observaciones],
      tramites: this.fb.array(tramitesArrayData),
      lotes: this.fb.array(LotesArrayData)




    });
    if (nomarcaService._expediente.id) { this.tipoFicha = 'existente' }
    console.log(customDatePipe.transformISOToUnix("2023-12-06"));
  }
  get tramites() {
    return this.fileForm.controls['tramites'] as FormArray;
  }
  get lotes() {
    return this.fileForm.controls['lotes'] as FormArray;
  }

  ngOnInit(): void {
    // // this.getAll();
    // this.subscriptionFormAction$ = this.workindDayFormService.getWorkinDayFormActionObservable().subscribe((action: EWorkinDayFormAction) => this.actionBtn = action)
    // this.subscriptionDataForm$ = this.workindDayFormService.getWorkingDayDataFormObservable().subscribe((wd: IWorkingDay) => {
    //   this.workingDayForm.setValue({
    //     projectId: wd.projectId,
    //     userId: wd.userId,
    //     taskTypeId: wd.taskTypeId,
    //     workingDate: this.customDatePipe.transformUnixToISO(wd.workingDate),
    //     timeSpent: wd.timeSpent,
    //   });
    //   this.workingDay = {
    //     id: wd.id,
    //     workingDate: wd.workingDate,
    //     userId: wd.userId,
    //     projectId: wd.projectId,
    //     taskTypeId: wd.taskTypeId,
    //     timeSpent: wd.timeSpent,
    //     taskCost: wd.taskCost * 20,
    //   };
    // })



  }
  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    // this.subscriptionFormAction$.unsubscribe();
    // this.subscriptionDataForm$.unsubscribe();
  }
  onSubmit() {
    this.isSubmitted = true;
    if (this.fileForm.invalid) {
      console.log('invalid form');

    } else {
      
      console.log('valid form');
      // cambiar fechas que viene de form con formato string a number
      if (this.fileForm.value.fechaAlta != 0) { this.fileForm.value.fechaAlta = this.customDatePipe.transformISOToUnix(this.fileForm.value.fechaAlta) }
      if (this.fileForm.value.fechaFinContrato != 0) { this.fileForm.value.fechaFinContrato = this.customDatePipe.transformISOToUnix(this.fileForm.value.fechaFinContrato) }
      if (this.fileForm.value.fechaInicioContrato != 0) { this.fileForm.value.fechaInicioContrato = this.customDatePipe.transformISOToUnix(this.fileForm.value.fechaInicioContrato) }
      if (this.fileForm.value.fechaLanzado != 0) { this.fileForm.value.fechaLanzado = this.customDatePipe.transformISOToUnix(this.fileForm.value.fechaLanzado) }
      if (this.fileForm.value.tramites) {
        for (let i = 0; i < this.fileForm.value.tramites.length; i++) {
          if (this.fileForm.value.tramites[i].fechatramite != 0) { this.fileForm.value.tramites[i].fechatramite = this.customDatePipe.transformISOToUnix(this.fileForm.value.tramites[i].fechatramite) }
        }
      }
      if (this.fileForm.value.lotes) {
        for (let i = 0; i < this.fileForm.value.lotes.length; i++) {
          if (this.fileForm.value.lotes[i].inicioLote != 0){this.fileForm.value.lotes[i].inicioLote = this.customDatePipe.transformISOToUnix(this.fileForm.value.lotes[i].inicioLote)}
          if (this.fileForm.value.lotes[i].finLote != 0){this.fileForm.value.lotes[i].finLote = this.customDatePipe.transformISOToUnix(this.fileForm.value.lotes[i].finLote)}
        }
      }
      console.log(this.fileForm.value);

      this.nomarcaService.create(this.fileForm.value).subscribe({
        next: data => console.log(data),
        error: error => console.error('There was an error!', error),
        complete: () => console.log("reponse ok")
      });
    }

  }
  addTramite() {
    this.showConfirmDialog.show({ title: "¿Desea añadir un nuevo trámite?", type: "logo" }).subscribe((result) => {
      if (result) {
        const tramiteForm = this.fb.group({
          fechatramite: [this.customDatePipe.transformUnixToISO(Math.floor(Date.now() / 1000))],
          observacionestramite: ['']
        });
        this.tramites.push(tramiteForm);
      }
    });

  }
  addLote(){
    this.showConfirmDialog.show({ title: "¿Desea añadir un nuevo lote?", type: "logo" }).subscribe((result) => {
      if (result){
        this.fileForm.patchValue({
          lote: this.lotes.controls.length+1
        });
        const lotesForm = this.fb.group({
          numlote:[this.fileForm.value.lote],
        material:[ ''],
        unidades:[ 0],
        importe:[ 0],
        economica:[ ''],
        estado:[ ''],
        prorroga:[ ''],
        empresa:[ ''],
        familia:[ ''],
        destino:[ ''],
        inicioLote:[ 0],
        finLote:[0],
        observaciones:[ '']
        });
        this.lotes.push(lotesForm);
      }
    });
  }
  addAnualidad(i:number){
    this.showConfirmDialog.show({ title: "¿Desea añadir una nueva anualidad?", type: "logo" }).subscribe((result) => {
      if (result){
        const loteFormGroup = this.lotes.at(i) as FormGroup;
        let anualidad:IAnualData = {
          title:"Anualidades del Lote "+this.fileForm.value.lote.toString(),
          unidades:loteFormGroup.get('unidades')?.value,
          importe:loteFormGroup.get('importe')?.value
        };
        this.showConfirmDialog.showWithComponentNomarca( NewLoteComponent,anualidad).subscribe((response:any) => {
          console.log(result);
          if (response){
          
          //  this.lotes.controls[i].value.unidades = result.unidades;
          //  this.lotes.controls[i].value.importe = result.importe;
           
            // Obtén el FormGroup actual
          

          // Usa patchValue para asignar valores sin afectar otros campos
          loteFormGroup.patchValue({
            unidades: response.unidades,
            importe: response.importe
          });
          }
      });
    }
    });
  }
}
