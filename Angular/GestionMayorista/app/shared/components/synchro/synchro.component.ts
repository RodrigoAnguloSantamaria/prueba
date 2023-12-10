
import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, OnInit, ViewChild, NgZone } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorIntl, MatPaginatorModule } from '@angular/material/paginator';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTableExporterModule } from 'mat-table-exporter';
import { WorkingDayComponent } from 'src/app/shared/components/working-day/working-day.component'
import { CustomDatePipe } from 'src/app/shared/pipes/customDate.pipe';
import { IdToNamePipe } from 'src/app/shared/pipes/id-to-name.pipe';
import { SynchroService } from './synchro.service';
import { Synchro } from '../../models/interfaces/Synchro';
import { forEach } from 'jszip';
import { PipeModule } from 'src/app/shared/pipes/pipe.module';
import { CustomTimePipe } from '../../pipes/custom-time.pipe';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { environment } from 'src/environments/environment';
// import { JsonExporterService, TxtExporterService } from 'mat-table-exporter' ;

// Necesario para cambiar la label de "Items per page" que viene por defecto en el paginador
export function CustomPaginator() {
  const customPaginatorIntl = new MatPaginatorIntl();
  customPaginatorIntl.itemsPerPageLabel = 'Tareas por pagina:';
  return customPaginatorIntl;
}

@Component({
  selector: 'app-synchro',
  templateUrl: './synchro.component.html',
  styleUrls: ['./synchro.component.css'],
  standalone: true,
  providers: [
    { provide: MatPaginatorIntl, useValue: CustomPaginator() },
    CustomDatePipe,
    IdToNamePipe,

  ],
  imports: [
    CommonModule,
    MatSnackBarModule,
    MatSortModule,
    MatPaginatorModule,
    MatDialogModule,
    MatIconModule,
    MatInputModule,
    FormsModule,
    MatTableModule,
    PipeModule,
    MatTableExporterModule,
    CustomTimePipe,
    MatButtonModule,
    MatTooltipModule
  ]
})
export class SynchroComponent implements AfterViewInit, OnInit {
  // ÑAPA PARA QUE LLAME A ENDPOINT EXISTENTE DE LLAMADAS QUE APUNTA A LA MISMA CARPETA DONDE ESTAN LOS ARCHIVOS
  fileUrl: string = environment.CALLS_URL + '/file/';
  displayedColumns: string[] = [
    'result',
    'fileName',
    'date',
    'time'

  ];


  //datos de la tabla
  dataSource = new MatTableDataSource<Synchro>();

  // Para filtros
  filterValues: any = {
    result: '',
    fileName: '',
    fechaInicio: 0,
    fechaFin: this.customDatePipe.transformDateToUnix(new Date()),
    time: ''
  };
  filterSelectObj: any = [];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) set matSort(sort: MatSort) {
    this.dataSource.sort = sort;
    this.dataSource.sortingDataAccessor = (item: Synchro, property: string) => {
      switch (property) {
        case 'fecha':
          return new Date(item.date);
        default:
          return (item as any)[property];
      }
    };
    // Configurar la dirección de la ordenación como descendente
    this.dataSource.sort.direction = 'desc';
    // Aplicar la ordenación inicial
    this.dataSource.sort.sort({ id: 'fecha', start: 'desc', disableClear: false });
  }

  constructor(
    public dialog: MatDialog,
    private customDatePipe: CustomDatePipe,
    private SynchroService: SynchroService,
    private zone: NgZone

  ) { }

  ngOnInit(): void {
    this.filterSelectObj = [
      {
        name: 'Resultado',
        columnProp: 'result',
        options: [],
      },
      {
        name: 'Archivo',
        columnProp: 'fileName',
        options: [],
      },
      {
        name: 'Fecha inicio',
        columnProp: 'fechaInicio',
        options: [],
      },
      {
        name: 'Fecha fin',
        columnProp: 'fechaFin',
        options: [],
      },
      {
        name: 'Hora',
        columnProp: 'time',
        options: [],
      },
    ];


    this.getApiData();
    this.dataSource.filterPredicate = this.createFilter();

    // PARA PROBAR PORQUE NO FUNCIONAN LOS FILTROS
    // this.SynchroService.getSynchroData().subscribe((data: Synchro[]) => {
    //   this.dataSource.data = data;
    // });

  }
  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  // ____________FUNCIONES PARA EL FLITRADO DE LA TABLA____________
  // Obtiene los valores unicos de cada columna que se mostraran en su desplegable para filtrar
  // getFilterObject(fullObj: any, key: any) {
  //   const uniqChk: any = [];
  //   fullObj.filter((obj: any) => {
  //     if (!uniqChk.includes(obj[key])) {
  //       let value = obj[key];
  //       uniqChk.push(value);
  //     }
  //     return obj;
  //   });
  //   //Ordenar los valores en descendente
  //   uniqChk.sort((n1: any, n2: any) => {
  //     if (n1 > n2) return 1;
  //     if (n1 < n2) return -1;
  //     return 0;
  //   });
  //   return uniqChk;
  // }

  // Llamada al servicio para obtener los datos de la tabla
  getApiData() {
    this.SynchroService.getSynchroData().subscribe((data: any) => {

      this.dataSource.data = data;

    });
  }




  // Se llama cuando cambian los filtros
  filterChange(filter: any, event: any) {
    if (filter.columnProp === 'fechaInicio') {
      this.filterValues['fechaInicio'] = this.customDatePipe.transformISOToUnix(event.target.value);
    } else if (filter.columnProp === 'fechaFin') {
      this.filterValues['fechaFin'] = this.customDatePipe.transformISOToUnix(event.target.value, true);
    } else {
      this.filterValues[filter.columnProp] = event.target.value.trim().toLowerCase();
    }
    this.dataSource.filter = JSON.stringify(this.filterValues);

    ////////////////////////////////////////////////////////////////
    // PROBAR PORQUE NO VAN LOS FILTORS
    // this.zone.run(() => {
    //   this.dataSource.filter = JSON.stringify(this.filterValues);
    // });
    ////////////////////////////////////////////////////////////////
  }
  // Crea el filtro que se aplica a la visualizacion de los datos
  createFilter() {


    let filterFunction = function (data: Synchro, filter: string): boolean {

      let searchTerms = JSON.parse(filter);

      // Recorrer los elementos de la tabla buscando aquellos que cuadren con los filtros, devolver true en esos casos
      let nameSearch = () => {
        // Adaptar los elemetos con el nombre de la columna

        return (
          data.fileName
            .toString()
            .toLowerCase()
            .indexOf(searchTerms.fileName) !== -1 &&
          data.result
            .toString()
            .toLowerCase()
            .indexOf(searchTerms.result) !== -1 &&
          data.date >= (searchTerms.fechaInicio) &&
          data.date <= (searchTerms.fechaFin) &&
          data.time.toString().toLowerCase().indexOf(searchTerms.time) !== -1
        );
      };

      return nameSearch();
    };
    return filterFunction;
  }
  // Resetear los filtros y formularios
  resetFilters() {
    // Resetear los filtros
    this.filterValues = {
      result: '',
      fileName: '',
      fechaInicio: 0,
      fechaFin: this.customDatePipe.transformDateToUnix(new Date()),
      time: '',

    };
    // Resetear los valores seleccionados del formulario
    this.filterSelectObj.forEach((value: any, key: any) => {
      value.modelValue = '';
    });
    //Resetear los datos de la tabla filtrados
    this.dataSource.filter = '';
  }
  // ____________FUNCIONES DE LA COLUMNA DE ACCIONES PARA EDITAR Y ELIMINAR UN WORKINGDAY____________

  // Eliminar el elemento (fila) de la columna selecionada en BD y por lo tanto tambien en tabla
  // deleteTask(row: any) {
  //   // console.log(row + " deleted");
  //   var id = row.id;
  //   var taskId = row.projectId + row.userId + row.taskTypeId;

  //   this.workingDayService.delete(id, taskId).subscribe(() => {
  //     this. getApiData();
  //     this.snackBar.open('Jornada eliminada correctamente!', 'Ok', {
  //       duration: 2000,
  //     });
  //   });
  // }

  // Si se pulsa el editar de un elemento pasamos los datos del mismo para que salga el formulario relleno con ellos
  // editTask(row: IWorkingDay) {
  //   console.log(row);
  //   row.projectId = this.idToNamePipe.tranformNameToID(row.projectId);
  //   row.userId = this.idToNamePipe.tranformNameToID(row.userId);
  //   row.taskTypeId = this.idToNamePipe.tranformNameToID(row.taskTypeId);
  //   console.log(row);
  //   this.workindDayFormService.setWorkinDayFormActionObservable(
  //     EWorkinDayFormAction.EDIT
  //   );
  //   this.workindDayFormService.setWorkingDayDataFormObservable(row);
  //   this.openDialog();
  // }

  // Muestra el componente que es un formulario para crear y/o editar un elemento de la tabla
  openDialog(): void {
    this.dialog
      .open(WorkingDayComponent)
      .afterClosed()
      .subscribe(() => {
        this.getApiData();
      }); // TODO: optimizar, al cerrar el dialog hace simpre un getAll
  }

  // exportTableData(){
  //   exporter.exportTable('xlsx', {
  //     fileName: 'test',
  //     sheet: 'sheet_name',
  //     Props: { Author: 'Talha' }
  //   })
  // }


  // prueba(){
  //   this.SynchroService.prueba().subscribe();
  //   this.getApiData();
  // }



}
