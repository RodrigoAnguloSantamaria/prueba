import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { DateAdapter } from '@angular/material/core';
import { addMonths, endOfMonth, endOfQuarter, startOfMonth, startOfQuarter } from 'date-fns';
import { DateFilterService } from 'src/app/core/services/date-filter.service';
import { EFilterTypeDate } from '../../models/enums/FilterDateType.enum';
import { CustomDatePipe } from '../../pipes/customDate.pipe';

@Component({
  selector: 'app-date-filter',
  templateUrl: './date-filter.component.html',
  styleUrls: ['./date-filter.component.css'],
  providers: [CustomDatePipe],

})
export class DateFilterComponent implements OnInit {
  @Output() formValuesChanged = new EventEmitter<{
    startDateUnix: number,
    endDateUnix: number,
  }>();
  //Filtros para fechas
  typeOfDateFilter: EFilterTypeDate | string;
  // Rango de fechas para el filtrado

  dateRangeForm = this.fb.nonNullable.group({
    startDateISO: new FormControl<Date>(new Date("01/01/2019"), [Validators.required]),
    endDateISO: new FormControl<Date>(new Date(), [Validators.required]),
  });
  // dateRangeForm = new FormGroup({
  //   startDateISO: new FormControl<Date>(new Date(), [Validators.required]),
  //   endDateISO: new FormControl<Date>(new Date(),[Validators.required]),
  // });

  constructor(
    private customDatePipe: CustomDatePipe,
    private fb: FormBuilder,
    private dateFilterService: DateFilterService,
    private dateAdapter: DateAdapter<Date>,
  ) {
    this.typeOfDateFilter = EFilterTypeDate.ALL;
    this.dateAdapter.setLocale('es-ES'); // Hace que el formato del DatePicker sea dd/mm/aaaa
  }

  ngOnInit(): void {
    this.dateRangeForm.valueChanges.subscribe(() => {
      let startDate = this.dateRangeForm.get("startDateISO")?.value;
      let endDate = this.dateRangeForm.get("endDateISO")?.value;
      // console.log(startDate);
      // console.log(endDate);
      if (startDate == null) { // Si algunas de las dos es null o undefinded
        console.error("Fecha de inicio invalida, asegure que introduce un rango de fechas valido")
        this.dateRangeForm.get("startDateISO")?.setErrors({ 'matStartDateInvalid': true });
      } else if (endDate == null) { // Si algunas de las dos es null o undefinded
        console.error("Fecha de inicio invalida, asegure que introduce un rango de fechas valido")
        this.dateRangeForm.get("endDateISO")?.setErrors({ 'matEndDateInvalid': true });
      } else {
        this.dateFilterService.setRangeDatesObservable(
          {
            startDate: this.customDatePipe.transformDateToUnix(startDate),
            endDate: this.customDatePipe.transformDateToUnix(endDate)
          }
        );
        this.formValuesChanged.emit({
          startDateUnix: this.customDatePipe.transformDateToUnix(startDate),
          endDateUnix: this.customDatePipe.transformDateToUnix(endDate)
        });
      }
    });
    this.setInitialNumberOfDateType();
  }

  // onFormValuesChanged() {

  // }
  //__________FUNCIONES PARA LOS FILTROS POR FECHAS__________
  increaseOrDecreaseMonths(date: Date, numberToIncreaseOrDecrease: number): Date {
    return addMonths(date, numberToIncreaseOrDecrease);
  }
  increaseNumberOfDateType() {
    let sd: Date | null | undefined = this.dateRangeForm.get("startDateISO")?.value;
    let ed: Date | null | undefined = this.dateRangeForm.get("endDateISO")?.value;
    if (sd == null || ed == null) { // Si algunas de las dos es null o undefinded
      console.error("Fecha invalida, asegure que introduce un rango de fechas valido")
    } else {
      if (this.typeOfDateFilter.valueOf() === EFilterTypeDate.MONTH) {
        this.dateRangeForm.setValue({
          startDateISO: startOfMonth(this.increaseOrDecreaseMonths(sd, 1)),
          endDateISO: endOfMonth(this.increaseOrDecreaseMonths(ed, 1))
        });
        // this.dateRangeForm.get("startDateISO")?.markAsDirty();
      } else if (this.typeOfDateFilter.valueOf() === EFilterTypeDate.QUARTER) {
        this.dateRangeForm.setValue({
          startDateISO: startOfQuarter(this.increaseOrDecreaseMonths(sd, 3)),
          endDateISO: endOfQuarter(this.increaseOrDecreaseMonths(ed, 3))
        });
      } else if (this.typeOfDateFilter.valueOf() === EFilterTypeDate.ALL) {
        // No hacemos nada en este caso
      } else {
        console.log('no filtro');
      }
      // this.onFormValuesChanged();
    }
  }
  decreaseNumberOfDateType() {
    let sd: Date | null | undefined = this.dateRangeForm.get("startDateISO")?.value;
    let ed: Date | null | undefined = this.dateRangeForm.get("endDateISO")?.value;
    if (sd == null || ed == null) { // Si algunas de las dos es null o undefinded
      console.error("Fecha invalida, asegure que introduce un rango de fechas valido")
    } else {
      if (this.typeOfDateFilter.valueOf() === EFilterTypeDate.MONTH) {
        this.dateRangeForm.setValue({
          startDateISO: startOfMonth(this.increaseOrDecreaseMonths(sd, -1)),
          endDateISO: endOfMonth(this.increaseOrDecreaseMonths(ed, -1))
        });

      } else if (this.typeOfDateFilter.valueOf() === EFilterTypeDate.QUARTER) {
        this.dateRangeForm.setValue({
          startDateISO: startOfQuarter(this.increaseOrDecreaseMonths(sd, -3)),
          endDateISO: endOfQuarter(this.increaseOrDecreaseMonths(ed, -3))
        });

      } else if (this.typeOfDateFilter.valueOf() === EFilterTypeDate.ALL) {
        // No hacemos nada en este caso
      } else {
        console.log('no filtro');
      }
      // this.onFormValuesChanged();

    }
  }

  // Se llama cuando cambio el tipo de filtro (Todos, Mes o Trimestre)
  // Al cambiar de filtro si es mes o trimestre se busca
  // la fecha de inicio y fin del mes o trimestre en el que nos encontremos
  setInitialNumberOfDateType() {
    const currentDate: Date = new Date();
    if (this.typeOfDateFilter.valueOf() === EFilterTypeDate.MONTH) {
      this.dateRangeForm.setValue({
        startDateISO: startOfMonth(currentDate),
        endDateISO: endOfMonth(currentDate)
      });
      // this.startDateUnix = this.customDatePipe.getStartOfMonthFromUnixToUnix(currentDateUnix);
      // this.endDateUnix = this.customDatePipe.getEndOfMonthFromUnixToUnix(currentDateUnix);
    } else if (this.typeOfDateFilter.valueOf() === EFilterTypeDate.QUARTER) {
      // this.numberOfDateType = Math.floor(new Date().getMonth() / 3) + 1;
      this.dateRangeForm.setValue({
        startDateISO: startOfQuarter(currentDate),
        endDateISO: endOfQuarter(currentDate)
      });
      // this.startDateUnix = this.customDatePipe.getStartOfQuarterFromUnixToUnix(currentDateUnix);
      // this.endDateUnix = this.customDatePipe.getEndOfQuarterFromUnixToUnix(currentDateUnix);
      // console.log(this.numberOfDateType);
    } else if (this.typeOfDateFilter.valueOf() === EFilterTypeDate.ALL) {
      // this.numberOfDateType = 0;
      this.dateRangeForm.setValue({
        startDateISO: startOfQuarter(new Date("01/01/2019")),
        endDateISO: currentDate
      });
    } else {
      // this.startDate = 0;
      console.log('no filtro');
    }
    // this.onFormValuesChanged();

  }

}
