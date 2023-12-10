import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ChartsHttpService } from 'src/app/core/http/charts.http.service';
import { ProjectsInfoService } from 'src/app/core/services/projects-info.service';
import { EFilterTypeDate } from 'src/app/shared/models/enums/FilterDateType.enum';
import { IProjectInfo } from 'src/app/shared/models/interfaces/ProjectInfo.interface';
import { ISeriesData } from 'src/app/shared/models/interfaces/SeriesData.interface';
import { ISimpleData } from 'src/app/shared/models/interfaces/SimpleData.interface';
import { CustomDatePipe } from 'src/app/shared/pipes/customDate.pipe';


@Component({
  selector: 'app-forecast',
  templateUrl: './forecast.component.html',
  styleUrls: ['./forecast.component.css'],
  providers: [CustomDatePipe]

})
export class ForecastComponent implements OnInit {

  //Datos que no muestran fechas
  simpleRealData: ISimpleData[] = [];
  thereAreSimpleRealData: boolean = false
  //Datos que no muestran fechas
  simpleEstimatedData: ISimpleData[] = [];
  thereAreSimpleEstimatedData: boolean = false
  //Datos que muestran fechas
  seriesData: ISeriesData[] = [];
  thereAreSeriesData: boolean = false

  //Datos totales
  totalProjectsInfoData: IProjectInfo[] = []; // Contiene los datos del rango de fechas especifico
  allTotalProjectsInfoData: IProjectInfo[] = []; // Contiene todos los datos


  // totalEstimatedProjectsInfoData: IPojectInfo[] = [];
  //Tags para filtrado
  names: string[] = ['projectId', 'userId', 'taskTypeId']
  values: string[] = ['timeSpent', 'taskCost']
  nameSelected: string = 'projectId';
  valueSelected: string = 'timeSpent';

  //Filtros para fechas
  typeOfDateFilter: EFilterTypeDate;
  // Rango de fechas para el filtrado
  startDate: number = 0;
  endDate: number = Math.floor(new Date().getTime() / 1000);

  constructor(
    private projectsInfoService: ProjectsInfoService,
    private chartsHttpService: ChartsHttpService,
    private customDatePipe: CustomDatePipe,
  ) {
    this.typeOfDateFilter = EFilterTypeDate.ALL;
    // console.log(this.typeOfDateFilter);
    this.startDate = 0;
    this.endDate = this.customDatePipe.transformDateToUnix(new Date());

  }

  ngOnInit(): void {
    this.filterData();
  }

  onFormValuesChanged(formValues: any) {
    console.log(this.customDatePipe.transformUnixToISO(formValues.startDateUnix));
    console.log(this.customDatePipe.transformUnixToISO(formValues.endDateUnix));
    this.startDate = formValues.startDateUnix;
    this.endDate = formValues.endDateUnix;
    this.filterData();
  }

  filterData(): void {
    this.chartsHttpService.getTotalProjectsInfo(this.startDate, this.endDate).subscribe((data: any[]) => {
      if (this.totalProjectsInfoData.length === 0) {
        data.forEach((item: any) => {
          let projectInfo: IProjectInfo = {
            projectId: item.projectId,
            realTimeSpent: item.timeSpent,
            //Simulamos que el estimado es el real x un numero decimal de una cifra entre 1 y 2
            estimatedTimeSpent: this.randomEstimatedDataGenerator(item.timeSpent),
            realCost: item.taskCost,
            //Simulamos que el estimado es el real x un numero decimal de una cifra entre 1 y 2
            estimatedCost: this.randomEstimatedDataGenerator(item.taskCost),
          }
          this.totalProjectsInfoData.push(projectInfo);
          this.allTotalProjectsInfoData.push(projectInfo);
        });

      } else {
        this.totalProjectsInfoData = [];
        data.forEach((item: any) => {
          let projectInfo: IProjectInfo = {
            projectId: item.projectId,
            realTimeSpent: item.timeSpent,
            //Simulamos que el estimado es el real x un numero decimal de una cifra entre 1 y 2
            estimatedTimeSpent: this.allTotalProjectsInfoData.find((p) => p.projectId === item.projectId)?.estimatedTimeSpent || 0,
            realCost: item.taskCost,
            //Simulamos que el estimado es el real x un numero decimal de una cifra entre 1 y 2
            estimatedCost: this.allTotalProjectsInfoData.find((p) => p.projectId === item.projectId)?.estimatedCost || 0,
          }
          this.totalProjectsInfoData.push(projectInfo);
        });
        // console.log(this.totalProjectsInfoData);
        // console.log(this.allTotalProjectsInfoData);
      }
      this.projectsInfoService.setProjectsInfoObservable(this.totalProjectsInfoData);
    })
  }

  randomEstimatedDataGenerator(realData: number): number {
    const randomNumber = Math.floor(Math.random() * (20 - 7 + 1) + 7) / 10;
    return Math.round(realData * randomNumber);
  }

}


