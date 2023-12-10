import { Component, Input, OnInit } from '@angular/core';
import { LegendPosition } from '@swimlane/ngx-charts';
import { CustomDatePipe } from 'src/app/shared/pipes/customDate.pipe';

@Component({
  selector: 'app-grouped-bar-chart',
  templateUrl: './grouped-bar-chart.component.html',
  styleUrls: ['./grouped-bar-chart.component.css'],
  providers:[CustomDatePipe]
})
export class GroupedBarChartComponent implements OnInit {

  @Input() seriesData: any[] = [];
  @Input() nameSelected: string = 'projectId';
  @Input() valueSelected: string = 'timeSpent';
  @Input() typeOfDateFilter: string = 'thisMonth';

  xAxisLabel: string = 'Fechas';
  ngOnInit(): void {
  }

  // Fomatos
  yAxisTickFormatting = (val: number) => {
    var result: string = val.toLocaleString() + 'h';
    if (this.valueSelected === 'taskCost') {
      result = val.toLocaleString() + '€';
    }
    return result;
  }
  xAxisTickFormatting = (value: number | string) => {
    // Convertimos el value a numero, si no se puede Number() da NaN
    // Para comprobar si es NaN no se puede usar el === hay q usar la funcion isNaN
    if (isNaN(Number(value))) {
      return value;
    } else { // Es una fecha en formato numero lo pasamos a formato dd/mm/aaaa
      return this.customDatePipe.transform(value);
    }
  }
  // options
  view: [number, number] = [1000, 300];
  showXAxis: boolean = true;
  showYAxis: boolean = true;
  gradient: boolean = true;
  showLegend: boolean = true;
  noBarWhenZero: boolean = true;
  legendPosition : LegendPosition = LegendPosition.Below;
  showXAxisLabel: boolean = false;
  showYAxisLabel: boolean = false;
  yAxisLabel: string = this.valueSelected;
  legendTitle: string = this.nameSelected;

  // Hace que se redimensione el chart en funcion del tamaño de la ventana
  resizeChart(width: any): void {
    this.view = [width, 320]
  }
  constructor(private customDatePipe: CustomDatePipe) { }

}
