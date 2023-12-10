import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCommonModule, MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { PipeModule } from '../pipes/pipe.module';
import { CustomChartTooltipComponent } from './custom-chart-tooltip/custom-chart-tooltip.component';
import { WorkingDayComponent } from './working-day/working-day.component';
import { AdvPieChartGroupComponent } from './adv-pie-chart-group/adv-pie-chart-group.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { DateFilterModule } from './date-filter/date-filter.module';
import { LoadingComponent } from './loading/loading.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CustomAlertComponent } from './custom-alert/custom-alert.component';
import { MatIconModule } from '@angular/material/icon';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';




@NgModule({
  declarations: [
    WorkingDayComponent,
    CustomChartTooltipComponent,
    AdvPieChartGroupComponent,
    LoadingComponent,


  ],
  imports: [
    PipeModule,
    CommonModule,
    BsDatepickerModule,
    ReactiveFormsModule,
    FormsModule,
    MatSelectModule,
    MatOptionModule,
    MatSnackBarModule,
    MatFormFieldModule,
    MatInputModule,
    MatTooltipModule,
    MatCommonModule,
    NgxChartsModule,
    DateFilterModule,
    MatSnackBarModule,
    MatIconModule,
    ConfirmDialogComponent,
    CustomAlertComponent,
  ],
  exports: [
    WorkingDayComponent,
    CustomChartTooltipComponent,
    AdvPieChartGroupComponent,
    DateFilterModule,
    PipeModule,
    LoadingComponent,
  ],

})
export class SharedComponentsModule { }
