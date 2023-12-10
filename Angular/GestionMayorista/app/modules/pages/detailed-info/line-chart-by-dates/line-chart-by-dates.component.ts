import { Component, Input, OnInit } from '@angular/core';
import { LegendPosition } from '@swimlane/ngx-charts';
import { startOfDay, endOfDay } from 'date-fns';

import { ChartsHttpService } from 'src/app/core/http/charts.http.service';
import { DateFilterService } from 'src/app/core/services/date-filter.service';
import { IRangeDatesUnix } from 'src/app/shared/models/interfaces/RangeDatesUnix.interface';
import { ISeriesData } from 'src/app/shared/models/interfaces/SeriesData.interface';
import { ISimpleData } from 'src/app/shared/models/interfaces/SimpleData.interface';
import { CustomDatePipe } from 'src/app/shared/pipes/customDate.pipe';

@Component({
  selector: 'app-line-chart-by-dates',
  templateUrl: './line-chart-by-dates.component.html',
  styleUrls: ['./line-chart-by-dates.component.css'],
  providers: [CustomDatePipe]
})
export class LineChartByDatesComponent implements OnInit {
  @Input() id: string = 'P001';
  @Input() idType: string = 'projectId';

  // datos para el gráfico de línea
  singleReal: ISimpleData[] = [];
  totalSpentSoFar: number = 0;

  singleRealPredited: ISimpleData[] = [];
  totalSpentPredicted: number = 0;

  singleEstimated: ISimpleData[] = [];
  totalSpentEstimated: number = 0;
  startDateEstimated: Date = new Date();
  endDateEstimated: Date = new Date();

  dateOfSimulatedDataUnixFormat: number = 1688012919;
  serie: ISeriesData[] = [];

  //Estilos charts
  view: [number, number] = [1400, 500];
  resizeChart(width: any): void {
    this.view = [width, 500]
  }
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = true;
  showXAxisLabel = true;
  xAxisLabel = 'Fecha';
  showYAxisLabel = true;
  yAxisLabel = '€';

  legendPosition: LegendPosition = LegendPosition.Right;

  // Ajustar para el timeline
  yScaleMax = 0;
  yScaleMin = 0;
  yAxisStatus = YAxisStatus.Default;
  infoUserYAxisStatus = "Haga click en la linea del valor maximo que quiere fijar como tope en el eje y"
  // Fomatos
  timeYAxisTickFormatting = (val: number) => {
    var result: string = val.toLocaleString() + 'h';
    return result;
  }
  costYAxisTickFormatting = (val: number) => {
    var result: string = val.toLocaleString() + '€';
    return result;
  }
  constructor(
    private chartsHttpService: ChartsHttpService,
    private dateFilterService: DateFilterService,
    private customDatePipe: CustomDatePipe
  ) { }

  ngOnInit(): void {

    // console.log(this.id, this.idType);
    this.dateFilterService.getRangeDatesObservable().subscribe((rangeDates: IRangeDatesUnix) => {
      this.chartsHttpService.getAllDetailedProjectInfoGroupByDates(this.id, this.idType, "taskCost", rangeDates.startDate, rangeDates.endDate).subscribe((data) => {
        this.singleReal = data;
        this.serie = this.createSerieDataForLineChart();
        this.serie.forEach((s)=>{
          s.series = [...s.series]
        })
      })
    });

    // try {
    //   this.id = history.state.data.id;
    //   this.idType = history.state.data.idType;
    //   this.chartsHttpService.getAllDetailedProjectInfoGroupByDates(this.id, this.idType, "taskCost").subscribe((data) => {
    //     // console.log(data);

    //     this.singleReal = data;
    //     console.log(this.singleReal);
    //     this.serie = this.createSerieDataForLineChart();
    //     console.log(this.serie);

    //   })
    // } catch (error) {
    //   console.log(error);
    // }

  }

  createSerieDataForLineChart(): ISeriesData[] {
    // Datos obtenidos mediante la informacion actual del proyecto
    const singleRealModified: any[] = this.modifiedSingleData(this.singleReal);
    this.totalSpentSoFar = singleRealModified[singleRealModified.length - 1].value;

    // const randomMultiplicator = (Math.floor((Math.random() * 1) * 10) / 10 + 2);
    // Datos simulados de la estimacion se se hace al inicio de cada proyecto
    this.totalSpentEstimated = this.randomEstimatedDataGenerator(this.totalSpentSoFar);
    // this.totalSpentEstimated = Math.round(this.totalSpentSoFar * randomMultiplicator);
    this.startDateEstimated = singleRealModified[0].name; // Simulamos la fecha estimada es igual a la real en la que empiza el proyecto
    // Simulamos la fecha estimada es igual a la real en la que empiza el proyecto
    this.endDateEstimated = this.customDatePipe.transformUnixToDate(this.dateOfSimulatedDataUnixFormat);

    return [
      {
        name: '[1] Estimados',
        series: [
          {
            name: this.startDateEstimated,
            value: 0,
          },
          {
            name: this.endDateEstimated,
            value: this.totalSpentEstimated,
          },
        ]
      },
      {
        name: '[2] Actuales',
        series: singleRealModified
      },
      {
        name: '[3] Predecidos',
        series: [
          {
            name: singleRealModified[singleRealModified.length - 1].name, // Se hace la predicion desde la ultima fecha de la que tenemos datos
            value: this.totalSpentSoFar, // Dinero gastado a dia de hoy
          },
          {
            name: this.endDateEstimated, // Fecha fin del proyecto
            value: this.predictValue(singleRealModified, this.dateOfSimulatedDataUnixFormat),
          },
        ]
      }
    ];
  }
  modifiedSingleData(singleData: ISimpleData[]): any[] {
    let sum: number = 0;
    const result: any[] = [];
    for (let i = 0; i < singleData.length; i++) {
      // Los datos estan generados hasta el 30 de Julio, asi que paramos el bucle cuando llegue al dia en el que estramos
      if (parseInt(singleData[i].name) > this.customDatePipe.transformDateToUnix(endOfDay(new Date()))) {
        break;
      }
      sum += singleData[i].value;
      result.push({
        value: sum,
        name: this.customDatePipe.transformUnixToDate(parseInt(singleData[i].name))
      })

    }
    // console.log(result);

    return result;
  }

  onSelect(data: any): void {
    console.log('Item clicked', JSON.parse(JSON.stringify(data)));
    if (this.yAxisStatus === YAxisStatus.Default) {
      this.yScaleMin = data.value
      this.yAxisStatus = YAxisStatus.MinSelected
      this.infoUserYAxisStatus = "Haga click en la linea del valor maximo que quiere fijar como tope en el eje y";
    } else if (this.yAxisStatus === YAxisStatus.MinSelected) {
      this.yScaleMax = data.value
      this.yAxisStatus = YAxisStatus.MaxSelected
      this.infoUserYAxisStatus = "Haga click en cualquier valor de la linea para restablecer el maximo y minimo del eje y";
    } else {
      this.yScaleMax = 0
      this.yScaleMin = 0
      this.yAxisStatus = YAxisStatus.Default
      this.infoUserYAxisStatus = "Haga click en la linea del valor minimo que quiere fijar como tope en el eje y";
    }
    this.serie = [...this.serie]
  }

  predictValue(data: any[], date: number): number {
    // Convert dates to numbers
    const x = data.map(d => this.customDatePipe.transformDateToUnix(d.name));
    const y = data.map(d => d.value);

    // Calculate mean values
    const n = x.length;
    const meanX = x.reduce((a, b) => a + b) / n;
    const meanY = y.reduce((a, b) => a + b) / n;

    // Calculate slope
    const slope = (x.map((x, i) => x * y[i]).reduce((a, b) => a + b) - n * meanX * meanY) /
      (x.map(x => x * x).reduce((a, b) => a + b) - n * meanX * meanX);

    // Calculate intercept
    const intercept = meanY - slope * meanX;

    // Predict value for given date
    const prediction = intercept + slope * date;

    return Math.round(prediction);
  }

  randomEstimatedDataGenerator(realData: number): number {
    const randomNumber = Math.floor(Math.random() * (20 - 7 + 1) + 7) / 10;
    return Math.round(realData * randomNumber);
  }
}

enum YAxisStatus {
  Default,
  MinSelected,
  MaxSelected,
}

