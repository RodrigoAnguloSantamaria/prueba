import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { PipeModule } from '../../pipes/pipe.module';
import { DateFilterComponent } from './date-filter.component';



@NgModule({
  declarations: [DateFilterComponent],
  imports: [
    CommonModule,
    PipeModule,
    MatDatepickerModule,
    MatButtonToggleModule,
    FormsModule, // Si no importas este modulo te da problemas el ngModel
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    ReactiveFormsModule,
    MatInputModule,
    MatNativeDateModule,

    // MatSelectModule,
    // MatOptionModule,

  ],
  exports: [DateFilterComponent]
})
export class DateFilterModule { }
