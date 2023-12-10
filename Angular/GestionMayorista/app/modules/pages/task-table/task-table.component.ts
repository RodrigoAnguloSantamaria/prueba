import { NomarcaService } from './../../../core/services/nomarca.service';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from "@angular/material/dialog";
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { WorkingDayService } from 'src/app/core/http/working-day.http.service';
import { WorkindDayFormService } from 'src/app/core/services/workind-day-form.service';
import { WorkingDayComponent } from 'src/app/shared/components/working-day/working-day.component';
import { EWorkinDayFormAction } from 'src/app/shared/models/enums/WorkinDayFormAction.enum';
import { IMessageNomarca } from 'src/app/shared/models/interfaces/Table.interface';
import { IWorkingDay } from 'src/app/shared/models/interfaces/WorkingDay.interface';
import { CustomDatePipe } from 'src/app/shared/pipes/customDate.pipe';
import { IdToNamePipe } from 'src/app/shared/pipes/id-to-name.pipe';
// import { JsonExporterService, TxtExporterService } from 'mat-table-exporter' ;

// Necesario para cambiar la label de "Items per page" que viene por defecto en el paginador
export function CustomPaginator() {
  const customPaginatorIntl = new MatPaginatorIntl();
  customPaginatorIntl.itemsPerPageLabel = 'Tareas por pagina:';
  return customPaginatorIntl;
}
@Component({
  selector: 'app-task-table',
  templateUrl: './task-table.component.html',
  styleUrls: ['./task-table.component.css'],
  providers: [
    { provide: MatPaginatorIntl, useValue: CustomPaginator() },
    CustomDatePipe,
    IdToNamePipe
  ]
})

export class TaskTableComponent implements AfterViewInit, OnInit {
  displayedColumns: string[] = ['fecha', 'mensaje'];
  dataSource = new MatTableDataSource<IMessageNomarca>();

  // Para filtros
  filterValues: any = {
    'mensaje': '',
    'fechaInicio': 0,
    'fechaFin': this.customDatePipe.transformDateToUnix(new Date()),
  };
  filterSelectObj: any = [];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) set matSort(sort: MatSort) {
    this.dataSource.sort = sort;
  };

  constructor(
    public dialog: MatDialog,
    private workingDayService: WorkingDayService,
    private workindDayFormService: WorkindDayFormService,
    private customDatePipe: CustomDatePipe,
    private idToNamePipe: IdToNamePipe,
    private snackBar: MatSnackBar,
    private NomarcaService: NomarcaService,
  ) { }

  ngOnInit(): void {
    this.filterSelectObj = [
      {
        name: 'Fecha inicio',
        columnProp: 'fechaInicio',
        options: []
      },
      {
        name: 'Fecha fin',
        columnProp: 'fechaFin',
        options: []
      },
      {
        name: 'Mensaje',
        columnProp: 'mensaje',
        options: []
      },
     
    ]
    this.getRemoteData();
    this.dataSource.filterPredicate = this.createFilter();
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

  // Llamada al servicio para obtener los datos
  getRemoteData(): void {
    this.NomarcaService.getAllMessages().subscribe((data: any) => {
      this.dataSource.data = data;
      console.log(data);
      // Mapeo para extraer lo datos de cada columna y que se muestren en el select
      // this.filterSelectObj.filter((o: any) => {
      //   o.options = this.getFilterObject(this.dataSource.data, o.columnProp);
      // });
    });
  }

 // Se llama cuando cambian los filtros
 filterChange(filter: any, event: any) {
  console.log();
  if (filter.columnProp === 'fechaInicio') {
    this.filterValues["fechaInicio"] = this.customDatePipe.transformISOToUnix(event.target.value);
  } else if (filter.columnProp === 'fechaFin') {
    this.filterValues["fechaFin"] = this.customDatePipe.transformISOToUnix(event.target.value, true);
  } else {
    this.filterValues[filter.columnProp] = event.target.value.trim().toLowerCase()
  }
  this.dataSource.filter = JSON.stringify(this.filterValues)
  
}

  // Crea el filtro que se aplica a la visualizacion de los datos
  createFilter() {
    let filterFunction = function (data: IMessageNomarca, filter: string): boolean {
      let searchTerms = JSON.parse(filter);
      // Recorrer los elementos de la tabla buscando aquellos que cuadren con los filtros, devolver true en esos casos
      let nameSearch = () => { // Adaptar los elemetos con el nombre de la columna
        return data.mensaje.toString().toLowerCase().indexOf(searchTerms.mensaje) !== -1 &&
          data.fecha >= (searchTerms.fechaInicio) &&
          data.fecha <= (searchTerms.fechaFin)
      }
      return nameSearch()
    }
    return filterFunction
  }
  // Resetear los filtros y formularios
  resetFilters() {
    // Resetear los filtros
    this.filterValues = {
      'mensaje': '',
      'fechaInicio': 0,
      'fechaFin': this.customDatePipe.transformDateToUnix(new Date()),
    };
    // Resetear los valores seleccionados del formulario
    this.filterSelectObj.forEach((value: any, key: any) => {
      value.modelValue = '';
    })
    //Resetear los datos de la tabla filtrados
    this.dataSource.filter = "";
  }
  // ____________FUNCIONES DE LA COLUMNA DE ACCIONES PARA EDITAR Y ELIMINAR UN WORKINGDAY____________

  // Eliminar el elemento (fila) de la columna selecionada en BD y por lo tanto tambien en tabla
  // deleteTask(row: any) {
  //   // console.log(row + " deleted");
  //   var id = row.id;
  //   var taskId = row.projectId + row.userId + row.taskTypeId;

  //   this.workingDayService.delete(id, taskId).subscribe(() => {
  //     this.getRemoteData()
  //     this.snackBar.open('Jornada eliminada correctamente!', 'Ok', { duration: 2000 })
  //   });

  }

  // Si se pulsa el editar de un elemento pasamos los datos del mismo para que salga el formulario relleno con ellos
  // editTask(row: IWorkingDay) {
  //   console.log(row);
  //   row.projectId = this.idToNamePipe.tranformNameToID(row.projectId);
  //   row.userId = this.idToNamePipe.tranformNameToID(row.userId);
  //   row.taskTypeId = this.idToNamePipe.tranformNameToID(row.taskTypeId);
  //   console.log(row);
  //   this.workindDayFormService.setWorkinDayFormActionObservable(EWorkinDayFormAction.EDIT);
  //   this.workindDayFormService.setWorkingDayDataFormObservable(row);
  //   this.openDialog();
  // }

  // Muestra el componente que es un formulario para crear y/o editar un elemento de la tabla
  // openDialog(): void {
  //   this.dialog.open(WorkingDayComponent).afterClosed().subscribe(() => { this.getRemoteData() }); // TODO: optimizar, al cerrar el dialog hace simpre un getAll
  // }


  // exportTableData(){
  //   exporter.exportTable('xlsx', {
  //     fileName: 'test',
  //     sheet: 'sheet_name',
  //     Props: { Author: 'Talha' }
  //   })
  // }



