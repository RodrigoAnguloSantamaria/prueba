import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Observable, Subject, Subscription } from 'rxjs';
import { ProjectsInfoService } from 'src/app/core/services/projects-info.service';
import { IProjectInfo } from 'src/app/shared/models/interfaces/ProjectInfo.interface';
import { IdToNamePipe } from 'src/app/shared/pipes/id-to-name.pipe';

// Necesario para cambiar la label de "Items per page" que viene por defecto en el paginador
export function CustomPaginator() {
  const customPaginatorIntl = new MatPaginatorIntl();
  customPaginatorIntl.itemsPerPageLabel = 'Proyectos por pagina:';
  return customPaginatorIntl;
}
@Component({
  selector: 'app-projects-table',
  templateUrl: './projects-table.component.html',
  styleUrls: ['./projects-table.component.css'],
  providers: [
    { provide: MatPaginatorIntl, useValue: CustomPaginator() },
    IdToNamePipe
  ]
})
export class ProjectsTableComponent implements OnInit {
  // @Input() projectsInfo: IProjectInfo[] = [];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) matSort: MatSort = new MatSort();

  private subscription$: Subscription = new Subscription();
  // @ViewChild(MatSort) set matSort(sort: MatSort) {
  //   this.dataSource.sort = sort;
  // };
  columns: ICustomTableColumns[] = [{
    columnDef: 'select',
    header: '',
    footer: '-',
    format: '',
    cell: () => ``,
  }, {
    columnDef: 'projectId',
    header: 'ID',
    footer: '-',
    format: '',
    cell: (element: IProjectInfo) => `${element.projectId}`,
  }, {
    columnDef: 'projectName',
    header: 'Nombre del proyecto',
    footer: 'Total:',
    format: '',
    cell: (element: IProjectInfo) => `${this.idToNamePipe.transform(element.projectId)}`,
    // cell: (element: IProjectInfo) => `${this.idToNamePipe.transform(element.projectId)}`,
  }, {
    columnDef: 'realCost',
    header: 'Coste real',
    footer: 0,
    format: '€',
    cell: (element: IProjectInfo) => `${element.realCost}`,
  }, {
    columnDef: 'estimatedCost',
    header: 'Coste estimado',
    footer: 0,
    format: '€',
    cell: (element: IProjectInfo) => `${element.estimatedCost}`,
  }, {
    columnDef: 'realTimeSpent',
    header: 'Tiempo real',
    footer: 0,
    format: 'h',
    cell: (element: IProjectInfo) => `${element.realTimeSpent}`,
  }, {
    columnDef: 'estimatedTimeSpent',
    header: 'Tiempo estimado',
    footer: 0,
    format: 'h',
    cell: (element: IProjectInfo) => `${element.estimatedTimeSpent}`,
  },
  ];
  // dataSource = new MatTableDataSource<IProjectInfo>();
  dataSource: MatTableDataSource<IProjectInfo> = new MatTableDataSource<IProjectInfo>();
  displayedColumns: string[] = [];

  // Para filtros
  // filterValues: any = {
  //   'taskTypeId': '',
  //   'projectId': '',
  //   'userId': '',
  //   'workingDate': '',
  //   'timeSpent': ''
  // };
  // filterSelectObj: any = [];

  selection: SelectionModel<IProjectInfo> = new SelectionModel<IProjectInfo>();


  constructor(
    private projectsInfoService: ProjectsInfoService,
    private idToNamePipe: IdToNamePipe) { }

  ngOnInit(): void {
    // Nos subscribimos al componente padre que nos envia los datos filtrados por fechas
    // Cada vez que cambian los datos temos que reasignar los compoenentes de la tabla (sort,paginator,data,etc)
    this.subscription$ = this.projectsInfoService.getProjectsInfoObservable().subscribe((data) => {
      this.dataSource = new MatTableDataSource<IProjectInfo>(data); // Asignamos los datos del Observable a la tabla
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.matSort;
      this.selection = new SelectionModel<IProjectInfo>(true, [...this.dataSource.data]);
      this.projectsInfoService.setProjectsDataTableObservable(this.selection.selected);
      this.displayedColumns = this.columns.map(c => c.columnDef);
      this.setTotalValueForFooter();
    });
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.subscription$.unsubscribe();
  }
  // Llamada al servicio para obtener los datos
  // getRemoteData(): void {
  //   this.workingDayService.getAll().subscribe((data: IWorkingDay[]) => {
  //     // this.dataSource.data = data;
  //     // Mapeo para extraer los datos de cada columna y que se muestren en el select
  //     // this.filterSelectObj.filter((o: any) => {
  //     //   o.options = this.getFilterObject(this.dataSource.data, o.columnProp);
  //     // });
  //   });
  // }

  // Funcion que calcula y asigna los valores totales al footer de la tabla
  setTotalValueForFooter() {
    this.columns.forEach(element => {
      // Entra en las columnas que no tienen un footer establecido inicialmente
      // es decir las que no son un string y son de tipo number (esta comprobacion se hace en el if)
      // y de las que hay que calcular la suma de los valores
      if (!isNaN(Number(element.footer))) {
        // Este paso hay que hacerlo asi para acceder dinamicamente a la propiedad
        // de la columna que queremos, basicamente le estamos diciendo el tipo de la
        // key a la que queremos acceder
        const aux = element.columnDef as keyof typeof this.dataSource.data[0];
        element.footer = this.dataSource.data.map(column => column[aux])
          .reduce((acc, value) => Number(acc) + Number(value), 0);
      }
    });

  }


  // FUNCIONES PARA LA COLUMNA DEL CHECKBOX

  // Cuando se cambian las columnas seleccionadas actualizamos los datos del observable
  // que alimenta a las graficas
  onSelectedDataChanged() {
    this.projectsInfoService.setProjectsDataTableObservable(this.selection.selected);
  }
  onRowSelectionChanged(row: any) {
    this.selection.toggle(row);
    this.onSelectedDataChanged();
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
      this.onSelectedDataChanged()
      return;
    }
    this.selection.select(...this.dataSource.sortData(this.dataSource.data, this.matSort));
    this.onSelectedDataChanged()
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: IProjectInfo): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.projectId + 1}`;
  }
}
interface ICustomTableColumns {
  columnDef: string,
  header: string,
  footer: string | number,
  format: string,
  cell: (element: IProjectInfo) => string,
}

