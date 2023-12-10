import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Form, FormBuilder, FormGroup } from '@angular/forms';
import { NomarcaService } from 'src/app/core/services/nomarca.service';
import { ShowConfirmDialogService } from 'src/app/shared/components/confirm-dialog/show-confirm-dialog.service';
import { CustomDatePipe } from 'src/app/shared/pipes/customDate.pipe';

@Component({
  selector: 'app-cash-form',
  templateUrl: './cash-form.component.html',
  styleUrls: ['./cash-form.component.css'],
  providers: [DatePipe, CustomDatePipe]
})
export class CashFormComponent implements OnInit {
cashForm!:FormGroup;
tipoAnticipo: string = 'nuevo';
isSubmitted:boolean = false;

  constructor(private fb: FormBuilder, public nomarcaService: NomarcaService, private datePipe: DatePipe, private customDatePipe: CustomDatePipe, private showConfirmDialog: ShowConfirmDialogService) { 

    this.cashForm = this.fb.group({
      id: [nomarcaService._anticipo.id],
      year: [this.nomarcaService._anticipo.year],
      concepto: [this.nomarcaService._anticipo.concepto],
      importe: [this.nomarcaService._anticipo.importe],
      fecha_autorizacion: [nomarcaService._anticipo.fecha_autorizacion ? customDatePipe.transformUnixToISO(nomarcaService._anticipo.fecha_autorizacion) : 0],
      fecha_presupuesto: [nomarcaService._anticipo.fecha_presupuesto ? customDatePipe.transformUnixToISO(nomarcaService._anticipo.fecha_presupuesto) : 0],
      fecha_envio: [nomarcaService._anticipo.fecha_envio ? customDatePipe.transformUnixToISO(nomarcaService._anticipo.fecha_envio) : 0],
      fecha_factura:  [nomarcaService._anticipo.fecha_factura ? customDatePipe.transformUnixToISO(nomarcaService._anticipo.fecha_factura) : 0],
      numero_factura: [nomarcaService._anticipo.numero_factura],
      empresa: [nomarcaService._anticipo.empresa],
      economica: [nomarcaService._anticipo.economica],
      provincia: [nomarcaService._anticipo.provincia],
      localidad: [nomarcaService._anticipo.localidad],  
      observaciones: [nomarcaService._anticipo.observaciones],
    });
    if (nomarcaService._anticipo.id) { this.tipoAnticipo = 'existente' }
   
  }
  onSubmit() {
    this.isSubmitted = true;
    if (this.cashForm.invalid) {
      console.log('invalid form');

    } else {
      // cambiar fechas que viene de form con formato string a number
      if (this.cashForm.value.fecha_autorizacion != 0) { this.cashForm.value.fecha_autorizacion = this.customDatePipe.transformISOToUnix(this.cashForm.value.fecha_autorizacion) }
      if (this.cashForm.value.fecha_presupuesto != 0) { this.cashForm.value.fecha_presupuesto = this.customDatePipe.transformISOToUnix(this.cashForm.value.fecha_presupuesto) }
      if (this.cashForm.value.fecha_envio != 0) { this.cashForm.value.fecha_envio = this.customDatePipe.transformISOToUnix(this.cashForm.value.fecha_envio) }
      if (this.cashForm.value.fecha_factura != 0) { this.cashForm.value.fecha_factura = this.customDatePipe.transformISOToUnix(this.cashForm.value.fecha_factura) }
      console.log(this.cashForm.value);

      this.nomarcaService.createCash(this.cashForm.value).subscribe({
        next: data => console.log(data),
        error: error => console.error('There was an error!', error),
        complete: () => console.log("reponse ok")
      });
  }


  }

  ngOnInit(): void {
  }

}
