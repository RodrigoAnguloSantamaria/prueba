import { IConfirmDialogData } from 'src/app/shared/models/interfaces/ConfirmDialogData.interface';

import { ComponentType } from '@angular/cdk/portal';
import { Injectable } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { ConfirmDialogComponent } from 'src/app/shared/components/confirm-dialog/confirm-dialog.component';


@Injectable({
  providedIn: 'root',
})
export class ShowConfirmDialogService {
  constructor(private dialog: MatDialog) {}

  // show(data: IConfirmDialogData, width?: string): Observable<boolean> {
    // const dialogConfig: MatDialogConfig<IConfirmDialogData> = {
    //   data,
    //   disableClose: true,
    // };
    // if (width) {
    //   dialogConfig.width = width;
    // }
    show(data:IConfirmDialogData): Observable<boolean> {
    const dialogRef = this.dialog.open( ConfirmDialogComponent,{data});
    return dialogRef.afterClosed();
  }

  showWithComponent(data: string, component: ComponentType<any>, width?: string,  anualidad?: IAnualData): Observable<boolean> {
    const dialogConfig: MatDialogConfig<string> = {
      data,
      disableClose: true,
      
    };

    if (width) {
      dialogConfig.width = width;
    }

    const dialogRef = this.dialog.open(component, dialogConfig);

    return dialogRef.afterClosed();
  }
  
  showWithComponentNomarca(component: ComponentType<any>,  anualidad?: IAnualData): Observable<boolean> {
    const dialogConfig: MatDialogConfig<IAnualData> = {
      data: anualidad,
      disableClose: true,
    };

    const dialogRef = this.dialog.open(component, dialogConfig);

    return dialogRef.afterClosed();
  }
}
export interface IAnualData{
  title:string,
  unidades:number,
  importe:number
}


