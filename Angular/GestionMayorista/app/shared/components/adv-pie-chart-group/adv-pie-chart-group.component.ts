import { Component, Inject, Input, OnInit, Optional } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ChartsHttpService } from 'src/app/core/http/charts.http.service';
import { DateFilterService } from 'src/app/core/services/date-filter.service';
import { ICustomTotalDataByTaskId } from '../../models/interfaces/CustomTotalDataByTaskId';
import { IDataForPrintComponents } from '../../models/interfaces/IDataForPrintComponents';
import { IRangeDatesUnix } from '../../models/interfaces/RangeDatesUnix.interface';
import { ISimpleData } from '../../models/interfaces/SimpleData.interface';
import { IdToNamePipe } from '../../pipes/id-to-name.pipe';
import { customCostFormat, customTimeFormat, customNameFormat } from '../../utils/chartsLabelFormats';

@Component({
  selector: 'app-adv-pie-chart-group',
  templateUrl: './adv-pie-chart-group.component.html',
  styleUrls: ['./adv-pie-chart-group.component.css'],
  providers: [IdToNamePipe]
})

//TODO: AdvPieChartGroupComponent Se puede optimizar este codigo
export class AdvPieChartGroupComponent implements OnInit {
  // El id para mostrar los graficos puede venir por dos partes diferentes
  // desde un componente padre. Por un lado puede llegar
  // -A taves del input(cuando queramos renderizarlo en la pagina de detailedPage)
  //  En este caso se mostraran 4 chart
  // -A taves del MAT_DIALOG_DATA(cuando queramos renderizarlo sobre la pagina de detailedPage en un dialog)
  //   En este ultimo caso se mostraran 2 chart
  @Input() id: string = '';
  constructor(
    @Optional() @Inject(MAT_DIALOG_DATA) public dataDialog: any,
    public dialog: MatDialog,
    private chartsHttpService: ChartsHttpService,
    private dateFilterService: DateFilterService,
    private idToNamePipe: IdToNamePipe
  ) {
  }

  ids: string[] = [];
  itIsForDialog: boolean = false;

  allRealData: ICustomTotalDataByTaskId[] = [];
  cardChartComponentList: IDataForPrintComponents[] = [];
  dataLoaded: boolean = false;
  //Listas de datos en funcion de la info que se solicite
  totalCostByUsers: ISimpleData[] = [];
  totalTimeByUsers: ISimpleData[] = [];
  totalCostByTasks: ISimpleData[] = [];
  totalTimeByTasks: ISimpleData[] = [];
  totalCostByProjects: ISimpleData[] = [];
  totalTimeByProjects: ISimpleData[] = [];

  //Estilos de los charts
  view: [number, number] = [700, 250];
  resizeChart(width: any): void {
    this.view = [width, 250]
  }
  // get valueCostFormatting(): any { return customCostFormat };
  // get valueTimeFormatting(): any { return customTimeFormat };
  // get nameUserFormatting(): any { return customUserNameFormat };
  // get nameTaskFormatting(): any { return customTaskNameFormat };
  totalSpentSoFar: number = 0;


  ngOnInit(): void {
    //Comprobamos desde donde se esta creado el componenete
    if (this.dataDialog) {
      console.log(this.dataDialog.id);
      this.allRealData = this.dataDialog.data;
      this.id = this.dataDialog.id;
      this.itIsForDialog = true;
    } else if (this.id !== '') {
      this.itIsForDialog = false;
    } else {
      console.error("Se necesita introducir un id")
    }

    //Separamos el id del elemento que se quiere obtener informacion
    this.ids = this.id.match(/.{1,4}/g) || [];
    console.log(this.ids);

    if (this.ids.length <= 0 || this.ids.length > 3) {
      console.error(this.id + ": id introducido para obtener su informacion especifica incorrecto.")
    } else {

      switch (this.ids.length) {
        //Si solo hay 1 id solicitar info total de ese elemento (projecto, usuario o tarea).
        case 1:
          this.dateFilterService.getRangeDatesObservable().subscribe((rangeDates: IRangeDatesUnix) => {
            this.cardChartComponentList = [];
            this.chartsHttpService.getTotalInfoGroupByTaskId(this.id, rangeDates.startDate, rangeDates.endDate).subscribe((data) => {
              this.allRealData = data;
              this.getDetailedInfoForOneEntity(data);
              // Para refrescar los datos los datos
              // this.cardChartComponentList = [...this.cardChartComponentList]
              this.cardChartComponentList.forEach((cardChart) => {
                cardChart.data = [...cardChart.data]
              })
              this.dataLoaded = true;
            })

          });

          break;

        //Si hay 2 id solicitar info total de por ej.: el empleado U001 en el projecto P001
        //Ojo este caso solo sucede cuando se crea el componente dialog y vienen los datos del padre
        case 2:
          this.getSpecificInfoForTwoEntity(this.allRealData);
          break;

        // Solicitar info total de por ej.: la tarea T001, del empleado U001 en el projecto P001
        // Se podria usar esto si por ejemplo se quiere ver en que fechas el U001 ha realizado la tarea T001 en el projecto P001
        // **Para este caso hay que modificar el backend
        case 3:
          break;

        default:
          break;
      }
    }

  }

  cleanOldData() {
    // Eliminamos los datos antiguos
    this.cardChartComponentList = [];
    this.totalCostByUsers = [];
    this.totalTimeByUsers = [];
    this.totalCostByTasks = [];
    this.totalTimeByTasks = [];
    this.totalCostByProjects = [];
    this.totalTimeByProjects = [];
  }
  // Genera la información necesaria para mostrar los componentes. Para ids unicos (P001, U001, o T001)
  getDetailedInfoForOneEntity(data: ICustomTotalDataByTaskId[]) {
    // Eliminamos los datos antiguos
    this.cleanOldData();

    switch (this.id[0]) {
      case 'P':
        data.forEach((element: ICustomTotalDataByTaskId) => {
          this.setTotalsCostByUsers(element); this.setTotalsTimeByUsers(element);
          this.setTotalsCostByTasks(element); this.setTotalsTimeByTasks(element);
        })
        this.sortAndPushCostByUsers(); this.sortAndPushTimeByUsers();
        this.sortAndPushCostByTasks(); this.sortAndPushTimeByTasks();
        break;
      case 'U':
        data.forEach((element: ICustomTotalDataByTaskId) => {
          this.setTotalsCostByProjects(element); this.setTotalsTimeByProjects(element);
          this.setTotalsCostByTasks(element); this.setTotalsTimeByTasks(element);
        })
        this.sortAndPushCostByProjects(); this.sortAndPushTimeByProjects();
        this.sortAndPushCostByTasks(); this.sortAndPushTimeByTasks();
        break;
      case 'T':
        data.forEach((element: ICustomTotalDataByTaskId) => {
          this.setTotalsCostByProjects(element); this.setTotalsTimeByProjects(element);
          this.setTotalsCostByUsers(element); this.setTotalsTimeByUsers(element);
        })
        this.sortAndPushCostByProjects(); this.sortAndPushTimeByProjects();
        this.sortAndPushCostByUsers(); this.sortAndPushTimeByUsers();
        break;
      default:
        break;
    }
  }
  // Genera la información necesaria para mostrar los componentes. Para ids unicos (P001U001, P001T001, U001T001, etc)
  getSpecificInfoForTwoEntity(data: ICustomTotalDataByTaskId[]) {
    // Eliminamos los datos antiguos
    this.cleanOldData();
    const posibleIds: string = 'PUT';//ProjecUserTask
    const missingId: string = posibleIds.replace(this.ids[0][0], '').replace(this.ids[1][0], '');

    switch (missingId) {
      case 'P':
        data.forEach((element: ICustomTotalDataByTaskId) => {
          this.setTotalsCostByProjects(element); this.setTotalsTimeByProjects(element);
        })
        this.sortAndPushCostByProjects(); this.sortAndPushTimeByProjects();
        break;
      case 'U':
        data.forEach((element: ICustomTotalDataByTaskId) => {
          this.setTotalsCostByUsers(element); this.setTotalsTimeByUsers(element);
        })
        this.sortAndPushCostByUsers(); this.sortAndPushTimeByUsers();
        break;
      case 'T':
        data.forEach((element: ICustomTotalDataByTaskId) => {
          this.setTotalsCostByTasks(element); this.setTotalsTimeByTasks(element);
        })
        this.sortAndPushCostByTasks(); this.sortAndPushTimeByTasks();
        break;
      default:
        break;
    }
  }

  // Cuando hacemos click en algun elemento de la grafica nos redirige a una pagina que muestra informacion detallada de ese elemento
  onSelect(data: any): void {
    console.log('Item clicked', JSON.parse(JSON.stringify(data)));
    const extractedDataFromParent: ICustomTotalDataByTaskId[] = this.allRealData.filter(
      (obj: ICustomTotalDataByTaskId) => obj.name.includes(this.id) && obj.name.includes(data.name));

    this.openDialog({
      id: this.id + data.name,
      data: extractedDataFromParent
    });
  }
  // Muestra informacion especifica. Por ejemplo.: puede mostrar el tiempo y coste cada tarea que realiza
  // un empleado en un determinado proyecto
  openDialog(data?: any): void {
    this.dialog.open(AdvPieChartGroupComponent, {
      height: '90%',
      width: '90%',
      data: data
    });
  }


  // -------------------------------------------------------------------------------
  // ------------ Funciones para generar los datos para los componentes ------------
  // -------------------------------------------------------------------------------
  setTotalsCostByUsers(element: ICustomTotalDataByTaskId) {
    const userId: string = element.name.substring(4, 8);

    // Coste total por usuario
    const existedObjUserCost: ISimpleData | undefined = this.totalCostByUsers.find(d => d.name === userId);
    if (existedObjUserCost) { // Existe el usuario sumamos el valor q habia con el actual iterado
      existedObjUserCost.value += element.valueCost
    } else {
      this.totalCostByUsers.push(
        {
          name: userId,
          value: element.valueCost
        }
      )
    }

  }
  sortAndPushCostByUsers() {
    this.totalCostByUsers.sort((a, b) => b.value - a.value)
    this.cardChartComponentList.push({
      cardTitle: 'Coste en euros por empleado.',
      cardText: 'Texto informativo',
      chartTotalLabel: 'Empleados',
      chatNameFormatting: customNameFormat,
      chatValueFormatting: customCostFormat,
      tooltipNameType: 'userId',
      tooltipValueType: 'taskCost',
      data: this.totalCostByUsers,
    })

  }
  // Ordenamos los datos y lo añadimos al array para renderizar los componentes
  setTotalsTimeByUsers(element: ICustomTotalDataByTaskId) {
    const userId: string = element.name.substring(4, 8);

    // Tiempo total por usuario
    const existedObjUserTime: ISimpleData | undefined = this.totalTimeByUsers.find(d => d.name === userId);
    if (existedObjUserTime) {
      existedObjUserTime.value += element.valueTime
    } else {
      this.totalTimeByUsers.push(
        {
          name: userId,
          value: element.valueTime
        }
      )
    }
  }
  sortAndPushTimeByUsers() {
    this.totalTimeByUsers.sort((a, b) => b.value - a.value)
    this.cardChartComponentList.push({
      cardTitle: 'Coste en horas por empleado.',
      cardText: 'Texto informativo',
      chartTotalLabel: 'Empleados',
      chatNameFormatting: customNameFormat,
      chatValueFormatting: customTimeFormat,
      tooltipNameType: 'userId',
      tooltipValueType: 'timeSpent',
      data: this.totalTimeByUsers,
    })

  }
  // Ordenamos los datos y lo añadimos al array para renderizar los componentes
  setTotalsCostByTasks(element: ICustomTotalDataByTaskId) {
    const taskTypeId: string = element.name.substring(8);

    // Coste total por tarea
    const existedObjTaskCost: ISimpleData | undefined = this.totalCostByTasks.find(d => d.name === taskTypeId);
    if (existedObjTaskCost) {
      existedObjTaskCost.value += element.valueCost
    } else {
      this.totalCostByTasks.push(
        {
          name: taskTypeId,
          value: element.valueCost
        }
      )
    }
  }
  sortAndPushCostByTasks() {
    this.totalCostByTasks.sort((a, b) => b.value - a.value)
    this.cardChartComponentList.push({
      cardTitle: 'Coste en euros por tarea.',
      cardText: 'Texto informativo',
      chartTotalLabel: 'Tareas',
      chatNameFormatting: customNameFormat,
      chatValueFormatting: customCostFormat,
      tooltipNameType: 'taskTypeId',
      tooltipValueType: 'taskCost',
      data: this.totalCostByTasks,
    })

  }
  // Ordenamos los datos y lo añadimos al array para renderizar los componentes
  setTotalsTimeByTasks(element: ICustomTotalDataByTaskId) {
    const taskTypeId: string = element.name.substring(8);

    // Tiempo total por tarea
    const existedObjTaskTime: ISimpleData | undefined = this.totalTimeByTasks.find(d => d.name === taskTypeId);
    if (existedObjTaskTime) {
      existedObjTaskTime.value += element.valueTime
    } else {
      this.totalTimeByTasks.push(
        {
          name: taskTypeId,
          value: element.valueTime
        }
      )
    }
  }
  sortAndPushTimeByTasks() {
    this.totalTimeByTasks.sort((a, b) => b.value - a.value)
    this.cardChartComponentList.push({
      cardTitle: 'Tiempo en horas por tarea.',
      cardText: 'Texto informativo',
      chartTotalLabel: 'Tareas',
      chatNameFormatting: customNameFormat,
      chatValueFormatting: customTimeFormat,
      tooltipNameType: 'taskTypeId',
      tooltipValueType: 'timeSpent',
      data: this.totalTimeByTasks,
    })

  }
  // Ordenamos los datos y lo añadimos al array para renderizar los componentes
  setTotalsCostByProjects(element: ICustomTotalDataByTaskId) {
    const projectId: string = element.name.substring(0, 4);

    // Coste total por proyecto
    const existedObjProjectCost: ISimpleData | undefined = this.totalCostByProjects.find(d => d.name === projectId);
    if (existedObjProjectCost) {
      existedObjProjectCost.value += element.valueCost
    } else {
      this.totalCostByProjects.push(
        {
          name: projectId,
          value: element.valueCost
        }
      )
    }
  }
  sortAndPushCostByProjects() {
    this.totalCostByProjects.sort((a, b) => b.value - a.value)
    this.cardChartComponentList.push({
      cardTitle: 'Coste en euros por proyecto.',
      cardText: 'Texto informativo',
      chartTotalLabel: 'Proyectos',
      chatNameFormatting: customNameFormat,
      chatValueFormatting: customCostFormat,
      tooltipNameType: 'projectId',
      tooltipValueType: 'taskCost',
      data: this.totalCostByProjects,
    })

  }
  // Ordenamos los datos y lo añadimos al array para renderizar los componentes
  setTotalsTimeByProjects(element: ICustomTotalDataByTaskId) {
    const projectId: string = element.name.substring(0, 4);

    // Tiempo total por proyecto
    const existedObjProjectTime: ISimpleData | undefined = this.totalTimeByProjects.find(d => d.name === projectId);
    if (existedObjProjectTime) {
      existedObjProjectTime.value += element.valueTime
    } else {
      this.totalTimeByProjects.push(
        {
          name: projectId,
          value: element.valueTime
        }
      )
    }
  }
  sortAndPushTimeByProjects() {
    this.totalTimeByProjects.sort((a, b) => b.value - a.value)
    this.cardChartComponentList.push({
      cardTitle: 'Tiempo en horas por proyecto.',
      cardText: 'Texto informativo',
      chartTotalLabel: 'Proyectos',
      chatNameFormatting: customNameFormat,
      chatValueFormatting: customTimeFormat,
      tooltipNameType: 'projectId',
      tooltipValueType: 'timeSpent',
      data: this.totalTimeByProjects,
    })

  }
  // Ordenamos los datos y lo añadimos al array para renderizar los componentes



}


