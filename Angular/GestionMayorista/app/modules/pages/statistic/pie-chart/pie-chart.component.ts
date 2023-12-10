import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ISimpleData } from 'src/app/shared/models/interfaces/SimpleData.interface';
import { customCostFormat, customNameFormat, customTimeFormat } from 'src/app/shared/utils/chartsLabelFormats';

@Component({
  selector: 'app-pie-chart',
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.css']
})
export class PieChartComponent implements OnInit {

  @Input() simpleData: ISimpleData[] = [];
  @Input() nameSelected: string = 'projectId';
  @Input() valueSelected: string = 'timeSpent';

  // options
  view: [number, number] = [1000, 250];
  // Hace que se redimensione el chart en funcion del tamaño de la ventana
  resizeChart(width: any): void {
    this.view = [width, 320]
  }
  getValueFormat(): any {
    return (this.valueSelected === 'timeSpent') ? customTimeFormat : customCostFormat;
  }
  getTitle(): string {
    return this.valueSelected == 'timeSpent' ? 'Horas totales' : 'Coste total';
  }
  get nameFormatting(): any {
    return customNameFormat;
  };
  gradient: boolean = true;
  showLegend: boolean = true;
  showLabels: boolean = true;
  isDoughnut: boolean = false;

  constructor(
    private router: Router
  ) { }
  ngOnInit(): void {
    // console.log("llegan los datos");
    // console.log(this.simpleData);
    this.simpleData = [...this.simpleData];

  }
  // Cuando hacemos click en algun elemento de la grafica nos redirige a una pagina que muestra informacion detallada de ese elemento
  onSelect(data: any): void {
    console.log('Item clicked', JSON.parse(JSON.stringify(data)));
    this.router.navigate(['detailedInfo'], {
      state: {
        data: {
          id: data.name,
          idType: this.nameSelected,
        }
      }
    });
  }

  // Muestra el componente
  openDialog(data?: any): void {
    // this.dialog.open(, {
    //   data: data,
    // });
    // .afterClosed().subscribe(() => { this.getRemoteData() });
  }
}
