import { IConfirmDialogData } from 'src/app/shared/models/interfaces/ConfirmDialogData.interface';
import { id } from '@swimlane/ngx-charts';
import { NomarcaService } from '../../../core/services/nomarca.service';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import {
  IExpedientesNomarca,
  IMessageNomarca,
} from 'src/app/shared/models/interfaces/Table.interface';
import { CustomDatePipe } from 'src/app/shared/pipes/customDate.pipe';
import { IdToNamePipe } from 'src/app/shared/pipes/id-to-name.pipe';
import { ShowAlertService } from 'src/app/shared/components/custom-alert/show-alert.service';
import { ConfirmDialogComponent } from 'src/app/shared/components/confirm-dialog/confirm-dialog.component';
import { ShowConfirmDialogService } from 'src/app/shared/components/confirm-dialog/show-confirm-dialog.service';
import { Router } from '@angular/router';


// import { JsonExporterService, TxtExporterService } from 'mat-table-exporter' ;

// Necesario para cambiar la label de "Items per page" que viene por defecto en el paginador
export function CustomPaginator() {
  const customPaginatorIntl = new MatPaginatorIntl();
  customPaginatorIntl.itemsPerPageLabel = 'Tareas por pagina:';
  return customPaginatorIntl;
}
@Component({
  selector: 'app-file-table',
  templateUrl: './file-table.component.html',
  styleUrls: ['./file-table.component.css'],
  providers: [
    { provide: MatPaginatorIntl, useValue: CustomPaginator() },
    CustomDatePipe,
    IdToNamePipe,
  ],
})
export class FileTableComponent implements AfterViewInit, OnInit {
  displayedColumns: string[] = [
    'fechaLanzado',
    'numexpediente',
    'lote',
    'texto',
    'rc',
    'asignado',
    'dispuesto',
    'ok',
    'tipopresupuesto',
    'procedimiento',
    'cgasto',
    'acciones',
  ];
  dataSource = new MatTableDataSource<IExpedientesNomarca>();

  // Para filtros
  filterValues: any = {
    id: '',
    numexpediente: '',
    lote: '',
    texto: '',
    rc: '',
    asignado: '',
    dispuesto: '',
    ok: '',
    tipopresupuesto: '',
    procedimiento: '',
    cgasto: '',
    fecha: '',
    fechaInicio: 0,
    fechaFin: this.customDatePipe.transformDateToUnix(new Date()),
  };
  filterSelectObj: any = [];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) set matSort(sort: MatSort) {
    this.dataSource.sort = sort;
  }

  constructor(
    public dialog: MatDialog,
    private customDatePipe: CustomDatePipe,
    private idToNamePipe: IdToNamePipe,
    private snackBar: MatSnackBar,
    private NomarcaService: NomarcaService,
    private confirmService: ShowConfirmDialogService,
    private ShowAlertService: ShowAlertService,
    private router: Router

  ) { }

  ngOnInit(): void {
    this.filterSelectObj = [
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
        name: 'Num. expediente',
        columnProp: 'numexpediente',
        options: [],
      },
      {
        name: 'Lote',
        columnProp: 'lote',
        options: [],
      },
      {
        name: 'Texto',
        columnProp: 'texto',
        options: [],
      },
      {
        name: 'RC',
        columnProp: 'rc',
        options: [],
      },
      {
        name: 'Asignado',
        columnProp: 'asignado',
        options: [],
      },
      {
        name: 'Dispuesto',
        columnProp: 'dispuesto',
        options: [],
      },
      {
        name: 'Ok',
        columnProp: 'ok',
        options: [],
      },
      {
        name: 'Tipo Presupuesto',
        columnProp: 'tipopresupuesto',
        options: [],
      },
      {
        name: 'Procedimiento',
        columnProp: 'procedimiento',
        options: [],
      },
      {
        name: 'C. Gasto',
        columnProp: 'cgasto',
        options: [],
      },
    ];
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
    this.NomarcaService.getAllFiles().subscribe((data: any) => {
      this.dataSource.data = data;
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
      this.filterValues['fechaInicio'] = this.customDatePipe.transformISOToUnix(
        event.target.value
      );
    } else if (filter.columnProp === 'fechaFin') {
      this.filterValues['fechaFin'] = this.customDatePipe.transformISOToUnix(
        event.target.value,
        true
      );
    } else {
      this.filterValues[filter.columnProp] = event.target.value
        .trim()
        .toLowerCase();
    }
    this.dataSource.filter = JSON.stringify(this.filterValues);
  }

  // Crea el filtro que se aplica a la visualizacion de los datos
  createFilter() {
    let filterFunction = function (
      data: IExpedientesNomarca,
      filter: string
    ): boolean {
      let searchTerms = JSON.parse(filter);
      // Recorrer los elementos de la tabla buscando aquellos que cuadren con los filtros, devolver true en esos casos
      let nameSearch = () => {
        // Adaptar los elemetos con el nombre de la columna
        return (
          data.numexpediente
            .toString()
            .toLowerCase()
            .indexOf(searchTerms.numexpediente) !== -1 &&
          data.lote.toString().toLowerCase().indexOf(searchTerms.lote) !== -1 &&
          data.texto.toString().toLowerCase().indexOf(searchTerms.texto) !==
          -1 &&
          data.rc.toString().toLowerCase().indexOf(searchTerms.rc) !== -1 &&
          data.asignado
            .toString()
            .toLowerCase()
            .indexOf(searchTerms.asignado) !== -1 &&
          data.dispuesto
            .toString()
            .toLowerCase()
            .indexOf(searchTerms.dispuesto) !== -1 &&
          data.ok.toString().toLowerCase().indexOf(searchTerms.ok) !== -1 &&
          data.tipopresupuesto.toString().toLowerCase().indexOf(searchTerms.tipopresupuesto) !== -1 &&
          data.procedimiento.toString().toLowerCase().indexOf(searchTerms.procedimiento) !== -1 &&
          data.cgasto.toString().toLowerCase().indexOf(searchTerms.cgasto) !== -1 &&
          data.fechaLanzado >= searchTerms.fechaInicio &&
          data.fechaLanzado <= searchTerms.fechaFin
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
      numexpediente: '',
      lote: '',
      texto: '',
      rc: '',
      asignado: '',
      dispuesto: '',
      ok: '',
      tipopresupuesto: '',
      procedimiento: '',
      cgasto: '',
      fecha: '',
      fechaInicio: 0,
      fechaFin: this.customDatePipe.transformDateToUnix(new Date()),
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
  deleteFile(row: any) {
    // console.log(row + " deleted");
    var id = row.id;
    let data: IConfirmDialogData = { type: 'confirm', title: '¿Estas seguro de que quieres eliminar el expediente?' };

    this.confirmService.show(data).subscribe((result) => {
      if (result) {
        this.NomarcaService.delete(id).subscribe(() => {
          this.ShowAlertService.showCustomAlert(
            'Archivo borrado: ' + row.numexpediente,
            'success',
            5,
            'top',
            'center'
          );
          this.getRemoteData();


        },
          (error) => {

            this.ShowAlertService.showCustomAlert(
              'Error al borrar el archivo: ' + row.numexpediente,
              'error',
              5,
              'top',
              'center'
            );
          },);
      }
    }
    );
  }


  // createFile() {
  //   // console.log(row );
  // var id = id;

  //   this.NomarcaService.create(id).subscribe(() => {
  //     this.getRemoteData();
  //     this.snackBar.open('Expediente creado correctamente!', 'Ok', {
  //       duration: 2000,
  //     });
  //   });
  // }

  // Si se pulsa el editar de un elemento pasamos los datos del mismo para que salga el formulario relleno con ellos
  editFile(row: IExpedientesNomarca) {
    if (row.id) {

      this.NomarcaService.getFileById(row.numexpediente).subscribe({
        next: (expediente: any) => {
          this.NomarcaService.setExpediente(expediente);
        },
        error: (error) => { },
        complete: () => {


          this.router.navigate(['/file-form']);
        }
      });

    } else {
      console.error('Invalid row ID');
    }

    //   console.log(row);
    //   row.numexpediente = this.idToNamePipe.tranformNameToID(row.numexpediente);
    //  row.texto=this.idToNamePipe.tranformNameToID(row.texto);

    //   console.log(row);


    // this.NomarcaService.setWorkinDayFormActionObservable(
    //   EWorkinDayFormAction.EDIT
    // );
    // this.workindDayFormService.setWorkingDayDataFormObservable(row);
    // this.openDialog();
  }

  // Muestra el componente que es un formulario para crear y/o editar un elemento de la tabla
  openDialog(): void {
    this.dialog
      .open(FileTableComponent)
      .afterClosed()
      .subscribe(() => {
        this.getRemoteData();
      }); // TODO: optimizar, al cerrar el dialog hace simpre un getAll
  }
  addFile() {
    this.NomarcaService.expedienteInitialValues();
    this.router.navigate(['/file-form']);
  }

  // exportTableData(){
  // exporter.exportTable('xlsx', {
  //   fileName: 'test',
  //   sheet: 'sheet_name',
  //   Props: { Author: 'Talha' }
  // })
}
