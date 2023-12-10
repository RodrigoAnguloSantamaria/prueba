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
  IAnticiposNomarca,
  IConsultNomarca,
  IExpedientesNomarca,
  IMessageNomarca,
} from 'src/app/shared/models/interfaces/Table.interface';
import { CustomDatePipe } from 'src/app/shared/pipes/customDate.pipe';
import { IdToNamePipe } from 'src/app/shared/pipes/id-to-name.pipe';
import { ShowAlertService } from 'src/app/shared/components/custom-alert/show-alert.service';
import { ConfirmDialogComponent } from 'src/app/shared/components/confirm-dialog/confirm-dialog.component';
import { ShowConfirmDialogService } from 'src/app/shared/components/confirm-dialog/show-confirm-dialog.service';


// import { JsonExporterService, TxtExporterService } from 'mat-table-exporter' ;

// Necesario para cambiar la label de "Items per page" que viene por defecto en el paginador
export function CustomPaginator() {
  const customPaginatorIntl = new MatPaginatorIntl();
  customPaginatorIntl.itemsPerPageLabel = 'Tareas por pagina:';
  return customPaginatorIntl;
}
@Component({
  selector: 'app-consult-table',
  templateUrl: './consult-table.component.html',
  styleUrls: ['./consult-table.component.css'],
  providers: [
    { provide: MatPaginatorIntl, useValue: CustomPaginator() },
    CustomDatePipe,
    IdToNamePipe,
  ],
})
export class ConsultTableComponent implements AfterViewInit, OnInit {
  displayedColumns: string[] = [
    'year',
    'expediente',
    'centroGasto',
    'titulo',
    'vinculante',
    'economica',
    'rcYear',
    'rcDeslizado',
    'aDeslizado',
    'dDeslizado',
    'ok',
    'rcNegativo',
    'sinJustificar',
  ];
  dataSource = new MatTableDataSource<IConsultNomarca>();

  // Para filtros
  filterValues: any = {
    year: '',
    expediente: '',
    centroGasto: '',
    titulo: '',
    vinculante: '',
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
    private ShowAlertService: ShowAlertService

  ) { }

  ngOnInit(): void {
    this.filterSelectObj = [
      {
        name: 'Año',
        columnProp: 'year',
        options: [],
      },
      {
        name: 'Expediente',
        columnProp: 'expediente',
        options: [],
      },
      {
        name: 'CentroGasto',
        columnProp: 'centroGasto',
        options: [],
      },
      {
        name: 'Título',
        columnProp: 'titulo',
        options: [],
      },
      {
        name: 'Vinculante',
        columnProp: 'vinculante',
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
    this.NomarcaService.getAllConsult().subscribe((data: any) => {
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
      data: IConsultNomarca,
      filter: string
    ): boolean {
      let searchTerms = JSON.parse(filter);
      // Recorrer los elementos de la tabla buscando aquellos que cuadren con los filtros, devolver true en esos casos
      let nameSearch = () => {
        // Adaptar los elemetos con el nombre de la columna
     
        return (

          data.year
            .toString()
            .toLowerCase()
            .indexOf(searchTerms.year) !== -1 &&
            data.expediente
            .toString()
            .toLowerCase()
            .indexOf(searchTerms.expediente) !== -1 &&
          data.centroGasto.toString().toLowerCase().indexOf(searchTerms.centroGasto) !== -1 &&
          data.titulo.toString().toLowerCase().indexOf(searchTerms.titulo) !== -1 &&
          data.aDeslizado.toString().toLowerCase().indexOf(searchTerms.aDeslizado) !== -1 &&
          data.dDeslizado
            .toString()
            .toLowerCase()
            .indexOf(searchTerms.dDeslizado) !== -1 &&
          data.vinculante
            .toString()
            .toLowerCase()
            .indexOf(searchTerms.vinculante) !== -1 &&
          data.economica
            .toString()
            .toLowerCase()
            .indexOf(searchTerms.economica) !== -1 &&
          data.rcYear
            .toString()
            .toLowerCase()
            .indexOf(searchTerms.rcYear) !== -1 &&
          data.rcDeslizado
            .toString()
            .toLowerCase()
            .indexOf(searchTerms.rcDeslizado) !== -1 &&

          data.ok.toString().toLowerCase().indexOf(searchTerms.ok) !== -1 &&
          data.rcNegativo.toString().toLowerCase().indexOf(searchTerms.rcNegativo) !== -1 &&
          data.sinJustificar.toString().toLowerCase().indexOf(searchTerms.sinJustificar) !== -1 
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

      year:'',
    expediente:'',
    centroGasto:'',
    titulo:'',
    vinculante:'',
    economica:'',
    rcYear:'',
    rcDeslizado:'',
    aDeslizado:'',
    dDeslizado:'',
    ok:'',
    rcNegativo:'',
    sinJustificar:'',
    acciones:''
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
  deleteCash(row: any) {
    // console.log(row + " deleted");
    var id = row.id;
    let data: IConfirmDialogData = { type: 'confirm', title: '¿Estas seguro de que quieres eliminar el expediente?' };

    this.confirmService.show(data).subscribe((result) => {
      if (result) {
        this.NomarcaService.deleteCash(id).subscribe(() => {
          this.ShowAlertService.showCustomAlert(
            'Archivo borrado: ' + row.factura,
            'success',
            5,
            'top',
            'center'
          );
          this.getRemoteData();
          this.dataSource.filterPredicate = this.createFilter();

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
    console.log(row);
    row.numexpediente = this.idToNamePipe.tranformNameToID(row.numexpediente);
    row.texto = this.idToNamePipe.tranformNameToID(row.texto);

    console.log(row);
    // this.NomarcaService.setWorkinDayFormActionObservable(
    //   EWorkinDayFormAction.EDIT
    // );
    // this.workindDayFormService.setWorkingDayDataFormObservable(row);
    // this.openDialog();
  }

  // Muestra el componente que es un formulario para crear y/o editar un elemento de la tabla
  openDialog(): void {
    this.dialog
      .open(ConsultTableComponent)
      .afterClosed()
      .subscribe(() => {
        this.getRemoteData();
      }); // TODO: optimizar, al cerrar el dialog hace simpre un getAll
  }

  // exportTableData(){
  // exporter.exportTable('xlsx', {
  //   fileName: 'test',
  //   sheet: 'sheet_name',
  //   Props: { Author: 'Talha' }
  // })
}
