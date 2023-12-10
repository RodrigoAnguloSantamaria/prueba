import { Component, OnInit } from '@angular/core';
import { startOfMonth, startOfToday, startOfWeek, startOfYear } from 'date-fns';
import { ChartsHttpService } from 'src/app/core/http/charts.http.service';

import { ISeriesData } from 'src/app/shared/models/interfaces/SeriesData.interface';
import { ISimpleData } from 'src/app/shared/models/interfaces/SimpleData.interface';
import { CustomDatePipe } from 'src/app/shared/pipes/customDate.pipe';

@Component({
  selector: 'app-statistic',
  templateUrl: './statistic.component.html',
  styleUrls: ['./statistic.component.css'],
  providers: [CustomDatePipe]
})
export class StatisticComponent implements OnInit {

  //Datos que no muestran fechas
  simpleData: ISimpleData[] = [];
  thereAreSimpleData: boolean = false
  //Datos que muestran fechas
  seriesData: ISeriesData[] = [];
  thereAreSeriesData: boolean = false

  //Tags para filtrado
  names: any[] = [
    {
      "selectDef": 'projectId',
      "selectTitle": 'Proyectos',
    },
    {
      "selectDef": 'userId',
      "selectTitle": 'Empleados',
    },
    {
      "selectDef": 'taskTypeId',
      "selectTitle": 'Tareas',
    }
  ]
  values: any[] = [
    {
      "selectDef": 'timeSpent',
      "selectTitle": 'Tiempo',
    },
    {
      "selectDef": 'taskCost',
      "selectTitle": 'Coste',
    }
  ]
  nameSelected: string = 'projectId';
  valueSelected: string = 'timeSpent';

  //Filtros para fechas
  typeOfDateFilter: string = 'thisMonth';
  endDate: number = this.customDatePipe.transformDateToUnix(startOfToday());
  startDate: number = this.customDatePipe.transformDateToUnix(startOfMonth(new Date()))
  setEndDate(): void {
    if (this.typeOfDateFilter === "today") {
      this.startDate = this.customDatePipe.transformDateToUnix(startOfToday());
    } else if (this.typeOfDateFilter === "thisWeek") {
      this.startDate = this.customDatePipe.transformDateToUnix(startOfWeek(new Date()));
    } else if (this.typeOfDateFilter === "thisMonth") {
      this.startDate = this.customDatePipe.transformDateToUnix(startOfMonth(new Date()));
    } else if (this.typeOfDateFilter === "thisYear") {
      this.startDate = this.customDatePipe.transformDateToUnix(startOfYear(new Date()));
    } else {
      this.startDate = 0;
      console.log('no filtro');
    }
    this.filterData();
  }
  constructor(
    private chartsHttpService: ChartsHttpService,
    private customDatePipe: CustomDatePipe) { }

  ngOnInit(): void {
    this.filterData();
    // this.valueFormatting('h');
  }
  filterData(): void {
    // console.log(this.nameSelected + ' - ' + this.valueSelected + ' - ' + this.startDate + ' - ' + this.endDate);
    this.chartsHttpService.getAllOnSimpleChartFormat(this.nameSelected, this.valueSelected, this.startDate, this.endDate).subscribe((data: any[]) => {
      this.simpleData = data;
      this.thereAreSimpleData = !(this.simpleData.length === 0);
      // console.log(this.simpleData);
      // console.log("simpleData.length = " + this.simpleData.length);
    })

    // No permitir solicitar el dato de muchas fechas porque va lenta la app
    if (this.typeOfDateFilter !== '' && this.typeOfDateFilter !== 'thisYear') {
      this.chartsHttpService.getAllOnSeriesChartFormat(this.nameSelected, this.valueSelected, this.startDate, this.endDate).subscribe((data: any[]) => {
        this.seriesData = data;
        this.thereAreSeriesData = !(this.seriesData.length === 0);
        // console.log(this.seriesData);
        // console.log("seriesData.length = " + this.seriesData.length);
      })
    }

  }
}
