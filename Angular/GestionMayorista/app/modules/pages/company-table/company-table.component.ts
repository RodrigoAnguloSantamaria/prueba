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
  IEmpresasNomarca,
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
  selector: 'app-company-table',
  templateUrl: './company-table.component.html',
  styleUrls: ['./company-table.component.css'],
  providers: [
    { provide: MatPaginatorIntl, useValue: CustomPaginator() },
    CustomDatePipe,
    IdToNamePipe,
  ],
})
export class CompanyTableComponent implements AfterViewInit, OnInit {
  displayedColumns: string[] = [
    'cif',
    'empresa',
    'domicilio',
    'telefono',
    'centro_gasto',
    'acciones'
  ];
  dataSource = new MatTableDataSource<IEmpresasNomarca>();

  // Para filtros
  filterValues: any = {
    cif:'',
  empresa:'',
  domicilio:'',
  telefono:'',
  centro_gasto:''
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
   
  ) {}

  ngOnInit(): void {
    this.filterSelectObj = [
      {
        name: 'CIF',
        columnProp: 'cif',
        options: [],
      },
      {
        name: 'Empresa',
        columnProp: 'empresa',
        options: [],
      },
      {
        name: 'Domicilio',
        columnProp: 'domicilio',
        options: [],
      },
      {
        name: 'Teléfono',
        columnProp: 'telefono',
        options: [],
      },
      {
        name: 'Centro de Gasto',
        columnProp: 'centro_gasto',
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
    this.NomarcaService.getAllCompany().subscribe((data: any) => {
    
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
      data: IEmpresasNomarca,
      filter: string
    ): boolean {
      let searchTerms = JSON.parse(filter);
      // Recorrer los elementos de la tabla buscando aquellos que cuadren con los filtros, devolver true en esos casos
      let nameSearch = () => {
        // console.log('data:',data);
        // console.log('search:',searchTerms);
        
        
        // Adaptar los elemetos con el nombre de la columna
        return (
          data.cif.toString().toLowerCase().indexOf(searchTerms.cif) !== -1 &&
          data.empresa
            .toString()
            .toLowerCase()
            .indexOf(searchTerms.empresa) !== -1 &&
          data.domicilio.toString().toLowerCase().indexOf(searchTerms.domicilio) !== -1 &&
          data.telefono.toString().toLowerCase().indexOf(searchTerms.telefono) !== -1 &&
          data.centro_gasto.toString().toLowerCase().indexOf(searchTerms.centro_gasto) !== -1
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
      cif:'',
      empresa:'',
      domicilio:'',
      telefono:'',
      centro_gasto:''
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
  deleteCompany(row: any) {
    // console.log(row + " deleted");
    var id = row.id;
    let data: IConfirmDialogData = {type:'confirm', title:'¿Estas seguro de que quieres eliminar la empresa?'};

    this.confirmService.show(data).subscribe((result) => {
      if(result){
    this.NomarcaService.deleteCompany(id).subscribe(() => {
      this.ShowAlertService.showCustomAlert(
        'Empresa borrada: ' + row.empresa,
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
              'Error al borrar la empresa: ' + row.empresa,
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
  editFile(row: IEmpresasNomarca) {
    console.log(row);
  //   row.numexpediente = this.idToNamePipe.tranformNameToID(row.numexpediente);
  //  row.texto=this.idToNamePipe.tranformNameToID(row.texto);
   
 
    // this.NomarcaService.setWorkinDayFormActionObservable(
    //   EWorkinDayFormAction.EDIT
    // );
    // this.workindDayFormService.setWorkingDayDataFormObservable(row);
    // this.openDialog();
  }

  // Muestra el componente que es un formulario para crear y/o editar un elemento de la tabla
  openDialog(): void {
    this.dialog
      .open(CompanyTableComponent)
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
