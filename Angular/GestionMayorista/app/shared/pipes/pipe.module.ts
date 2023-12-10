import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CustomDatePipe } from './customDate.pipe';
import { IdToNamePipe } from './id-to-name.pipe';
import { ThousandsPipe } from './thousands.pipe';



@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    CustomDatePipe,
    IdToNamePipe,
    ThousandsPipe
  ],
  exports: [
    CustomDatePipe,
    IdToNamePipe,
    ThousandsPipe
  ],

})
export class PipeModule { }
