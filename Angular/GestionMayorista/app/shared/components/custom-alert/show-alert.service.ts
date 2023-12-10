import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CustomAlertComponent } from 'src/app/shared/components/custom-alert/custom-alert.component';


@Injectable({
  providedIn: 'root'
})
export class ShowAlertService {
  static showCustomAlert(arg0: string, arg1: string, arg2: number) {
    throw new Error('Method not implemented.');
  }

  constructor(private snackBar: MatSnackBar,) { }
  showCustomAlert(
    message: string = '',
    type: 'success' | 'error' | 'info' = 'info',
    duration: number = 1000,
    verticalPosition: 'top' | 'bottom' = 'top',
    horizontalPosition: 'start' | 'center' | 'end' | 'left' | 'right' = 'center',
    
  ) {
    this.snackBar.openFromComponent(CustomAlertComponent,
      {
        data:{
          message: message,
          icon: type === 'success' ? 'check_circle' : type
        },
        duration: duration * 1000,
        verticalPosition: verticalPosition,
        horizontalPosition: horizontalPosition,
        panelClass: [`alert-${type}`]
      }
    )
  }
}
