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
  selector: 'app-cash-table',
  templateUrl: './cash-table.component.html',
  styleUrls: ['./cash-table.component.css'],
  providers: [
    { provide: MatPaginatorIntl, useValue: CustomPaginator() },
    CustomDatePipe,
    IdToNamePipe,
  ],
})
export class CashTableComponent implements AfterViewInit, OnInit {
  displayedColumns: string[] = [
    'year',
    'concepto',
    'importe',
    'fecha_autorizacion',
    // 'fecha_presupuesto',
    // 'fecha_envio',
    // 'fecha_factura',
    'numero_factura',
    'empresa',
    'economica',
    'provincia',
    'localidad',
    'observaciones',
    'acciones'
  ];
  dataSource = new MatTableDataSource<IAnticiposNomarca>();

  // Para filtros
  filterValues: any = {
    
    year: '',
    concepto: '',
    importe: '',
    fecha_autorizacion:'',
    // fecha_presupuesto:'',
    // fecha_envio:'',
    // fecha_factura:'',
    numero_factura: '',
    empresa: '',
    economica: '',
    provincia: '',
    localidad: '',
    observaciones: '',
  
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
        name: 'Año',
        columnProp: 'year',
        options: [],
      },
      {
        name: 'Concepto',
        columnProp: 'concepto',
        options: [],
      },
      {
        name: 'Factura',
        columnProp: 'numero_factura',
        options: [],
      },
      {
        name: 'Económica',
        columnProp: 'economica',
        options: [],
      },
      {
        name: 'Provincia',
        columnProp: 'provincia',
        options: [],
      },
      {
        name: 'Localidad',
        columnProp: 'localidad',
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
    this.NomarcaService.getAllCash().subscribe((data: any) => {
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
      data: IAnticiposNomarca,
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
          data.concepto.toString().toLowerCase().indexOf(searchTerms.concepto) !== -1 &&
          data.importe.toString().toLowerCase().indexOf(searchTerms.importe) !== -1 &&
       
          
          data.numero_factura
            .toString()
            .toLowerCase()
            .indexOf(searchTerms.numero_factura) !== -1 &&
          data.empresa
            .toString()
            .toLowerCase()
            .indexOf(searchTerms.empresa) !== -1 &&
          data.economica
            .toString()
            .toLowerCase()
            .indexOf(searchTerms.economica) !== -1 &&
          data.provincia
            .toString()
            .toLowerCase()
            .indexOf(searchTerms.provincia) !== -1 &&
          data.localidad
            .toString()
            .toLowerCase()
            .indexOf(searchTerms.localidad) !== -1 &&

          data.fecha_autorizacion >= searchTerms.fechaInicio &&
          data.fecha_autorizacion <= searchTerms.fechaFin
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

      año: '',
      concepto: '',
      importe: '',
      fecha_autorizacion: '',
      fecha_presupuesto: '',
      fecha_envio: '',
      fecha_factura: '',
      numero_factura: '',
      empresa: '',
      economica: '',
      provincia: '',
      localidad: '',
      observaciones: '',
     
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
  editFile(row: IAnticiposNomarca) {
    if (row.id) {

      this.NomarcaService.getCashById(row.id).subscribe({
        next: (anticipo: any) => {
          this.NomarcaService.serAnticipo(anticipo);
        },
        error: (error) => { },
        complete: () => {


          this.router.navigate(['/cash-form']);
        }
      });

    } else {
      console.error('Invalid row ID');
    }
  }

  // Muestra el componente que es un formulario para crear y/o editar un elemento de la tabla
  openDialog(): void {
    this.dialog
      .open(CashTableComponent)
      .afterClosed()
      .subscribe(() => {
        this.getRemoteData();
      }); // TODO: optimizar, al cerrar el dialog hace simpre un getAll
  }
  addCash() {
    this.NomarcaService.anticipoInitialValues();
    this.router.navigate(['/cash-form']);
  }

  // exportTableData(){
  // exporter.exportTable('xlsx', {
  //   fileName: 'test',
  //   sheet: 'sheet_name',
  //   Props: { Author: 'Talha' }
  // })
}
