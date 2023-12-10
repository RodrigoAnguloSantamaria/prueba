import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-detailed-info',
  templateUrl: './detailed-info.component.html',
  styleUrls: ['./detailed-info.component.css']
})
export class DetailedInfoComponent implements OnInit {
  id: string = 'P001';
  idType: string = 'projectId';
  nameType: string = (this.idType === 'projectId') ? 'Proyecto' : (this.idType === 'userId') ? 'Empleado' : 'Tarea';
  // Datos simulados de la estimacion que se hace al inicio de cada proyecto
  totalSpentEstimated: number = 160000;
  constructor() { }


  ngOnInit(): void {
    // console.log(history.state.data);
    // console.log(history.state.data);

    if (history.state.data !== undefined) {
      this.id = history.state.data.id;
      this.idType = history.state.data.idType;
    }


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


}
