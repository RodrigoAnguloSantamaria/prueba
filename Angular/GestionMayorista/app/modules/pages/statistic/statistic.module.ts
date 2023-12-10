import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { NgxChartsModule } from "@swimlane/ngx-charts";
import { SharedComponentsModule } from 'src/app/shared/components/shared-components.module';
import { PipeModule } from 'src/app/shared/pipes/pipe.module';
import { GroupedBarChartComponent } from './grouped-bar-chart/grouped-bar-chart.component';
import { PieChartComponent } from './pie-chart/pie-chart.component';
import { StatisticComponent } from './statistic.component';


@NgModule({
  declarations: [
    StatisticComponent,
    PieChartComponent,
    GroupedBarChartComponent,
  ],
  imports: [
    SharedComponentsModule,
    PipeModule,
    CommonModule,
    NgxChartsModule,
    ReactiveFormsModule,
    FormsModule,
    MatSelectModule,
    MatOptionModule,
    MatButtonToggleModule,
  ],
  exports: [StatisticComponent, PieChartComponent, GroupedBarChartComponent]
})
export class StatisticModule { }
