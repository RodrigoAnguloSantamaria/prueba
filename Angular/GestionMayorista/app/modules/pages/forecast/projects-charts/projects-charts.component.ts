import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { LegendPosition } from '@swimlane/ngx-charts';
import { Subscription } from 'rxjs';
import { ProjectsInfoService } from 'src/app/core/services/projects-info.service';
import { IProjectInfo } from 'src/app/shared/models/interfaces/ProjectInfo.interface';
import { ISeriesData } from 'src/app/shared/models/interfaces/SeriesData.interface';
import { ISimpleData } from 'src/app/shared/models/interfaces/SimpleData.interface';
import { customCostFormat, customTimeFormat } from 'src/app/shared/utils/chartsLabelFormats';

@Component({
  selector: 'app-projects-charts',
  templateUrl: './projects-charts.component.html',
  styleUrls: ['./projects-charts.component.css'],
})
export class ProjectsChartsComponent implements OnInit {

  private subscription$: Subscription = new Subscription();
  @ViewChild('ContainerRef') divContainerRef!: ElementRef;


  seriesDataTime: ISeriesData[] = [];
  seriesDataCost: ISeriesData[] = [];
  simpleDataProfitCost: ISimpleData[] = [];
  xAxisLabel: string = 'Fechas';

  // Fomatos
  timeYAxisTickFormatting = customTimeFormat;
  costYAxisTickFormatting = customCostFormat;

  // options
  view: [number, number] = [1200, 400];
  showXAxis: boolean = true;
  showYAxis: boolean = true;
  gradient: boolean = true;
  showLegend: boolean = true;
  legendPosition: LegendPosition = LegendPosition.Below;
  showXAxisLabel: boolean = false;
  showYAxisLabel: boolean = false;

  resizeChart(width: any): void {
    this.view = [width, 400]
  }
  constructor(private projectsInfoService: ProjectsInfoService, private router: Router) { }

  ngOnInit(): void {
    this.subscription$ = this.projectsInfoService.getProjectsDataTableObservable().subscribe((data) => {
      this.setTransformedDataForValidChartFormat(data);
      this.seriesDataCost = [...this.seriesDataCost]
      this.seriesDataTime = [...this.seriesDataTime]
      this.simpleDataProfitCost = [...this.simpleDataProfitCost]
    });
  }

  ngAfterViewInit(): void {
    this.view = [this.divContainerRef.nativeElement.offsetWidth / 1.1, 300]
  }
  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.subscription$.unsubscribe();
  }
  setTransformedDataForValidChartFormat(tableData: IProjectInfo[]) {
    this.seriesDataCost = [];
    this.seriesDataTime = [];
    this.simpleDataProfitCost = [];
    tableData.forEach((data) => {
      if (data.projectId !== "") {
        this.seriesDataCost.push({
          name: data.projectId,
          series: [
            {
              name: "Coste estimado",
              value: data.estimatedCost
            },
            {
              name: "Coste real",
              value: data.realCost
            },
          ]
        });
        this.simpleDataProfitCost.push({
          name: data.projectId,
          value: data.estimatedCost - data.realCost,
        });
        this.seriesDataTime.push({
          name: data.projectId,
          series: [
            {
              name: "Tiempo estimado",
              value: data.estimatedTimeSpent
            },
            {
              name: "Tiempo real",
              value: data.realTimeSpent
            }
          ]
        });
      }
    });
  }

  // Cuando hacemos click en algun elemento de la grafica nos redirige a una pagina que muestra informacion detallada de ese elemento
  onSelect(data: any): void {
    console.log('Item clicked', JSON.parse(JSON.stringify(data)));
    this.router.navigate(['detailedInfo'], {
      state: {
        data: {
          id: data.series,
          idType: "projectId",
        }
      }
    });
  }
}
