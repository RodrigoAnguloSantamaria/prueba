import { Component, OnInit } from '@angular/core';
import { ChangeCronService } from './change-cron.service';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  NgModel,
  Validators,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { select } from 'd3';
import { ShowAlertService } from '../custom-alert/show-alert.service';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SynchroService } from '../synchro/synchro.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-change-cron',
  templateUrl: './change-cron.component.html',
  styleUrls: ['./change-cron.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, MatFormFieldModule, MatSelectModule, MatTooltipModule],
  providers: [ChangeCronService],
})
export class ChangeCronComponent implements OnInit {
  cronExpression: string = '';
  mailTo:String = '';

  hour: number = 0;
  minute: number =0;
  second: number = 0;
  selectTask: string = '';
  newCronExpression: string = '';
  day: number | string = '';
  daytosend: string = '';
  showCronForm: boolean = false;
  taskList: string[] = [
    "tarea1",
    "tarea2",
    "tarea3"
  ];
  mailIsValid:boolean = false;
 
  constructor(private changeCron: ChangeCronService,
    private showAlertService: ShowAlertService,
    private SynchroService: SynchroService,
    private router:Router) {}

    validEmail() {
      // Verificar si el correo tiene contenido y cumple con el patrón
      if (this.mailTo.length > 0 && this.validateEmail(this.mailTo.toString())) {
      
        this.mailIsValid = true;
      } else {
       
        this.mailIsValid = false;

      }
    }

    // Función para validar el patrón del correo electrónico usando una expresión regular
    private validateEmail(email: string): boolean {
      const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      return emailPattern.test(email);
    }
  updateCron(): void {
    this.cronExpression = `0 ${this.minute} ${this.hour} ${this.day} * ?`;
    this.newCronExpression = this.translateCronExpression(this.cronExpression,1);
    this.cronExpression = `0 ${this.minute} ${this.hour} ${this.daytosend} * ?`;
   
    const cronToSend = {
      cronExpression: this.cronExpression,
      task: "tarea1",
    };
    // Logic to validate the cron expression before updating
    this.changeCron.updateCronExpression(cronToSend).subscribe(
      (response) => {
        this.showAlertService.showCustomAlert(response + ' ' + this.newCronExpression,
        'success',
        5,
        'top',
        'center')
        console.log('Cron expression updated successfully', response);
        
        //this.getCron(); // Fetch the updated cron expression after successful update
      },
      (error) => {
        this.showAlertService.showCustomAlert(
          'Error al actualizar la expresión cron',
          'error',
          5,
          'top',
          'center'
        );
        // console.error('Error occurred while updating.', error);
        // // Log the response body, if available
        // if (error.error instanceof ErrorEvent) {
        //   console.error('Client-side error occurred:', error.error.message);
        // } else if (error.error && error.error.message) {
        //   console.error('Server-side error message:', error.error.message);
        // } else {
        //   console.error('Unknown error occurred:', error);
        // }
      }
    );

    let kk =0;
  }

  getCron() {
    this.changeCron.getCronExpression().subscribe(
      (expression) => {
        this.cronExpression = expression;
        this.newCronExpression = this.translateCronExpression(
          this.cronExpression,0
        );

        console.log('Cron expression:', this.cronExpression);
      },
      (error) => {
        console.error('Error al obtener la expresión cron', error);
      }
    );
  }

  translateCronExpression(newCronExpression: string, origen:number): string {
    let cronArray = Array.from(newCronExpression.split(' '));
    this.minute = +cronArray[1];
    this.hour = +cronArray[2];
    let stringDay = '';
    if (origen == 0){
      if (cronArray[3]=='*'){
        this.day = '1';
        stringDay = 'cada dia';
      }
      else{
        this.day = Number(cronArray[3].substring(2, cronArray[3].length));
        stringDay = 'cada ' + this.day + ' días';
      }
    }
    else{
      if (cronArray[3] == '1'){
        stringDay = 'cada dia';
        this.day = Number(cronArray[3]);
        this.daytosend = '*';
      }
      else{
        stringDay = 'cada ' + cronArray[3] + ' días';
        this.day = Number(cronArray[3]);
          for (let i = 2; i <= 30; i++) {
            if (cronArray[3] == i.toString()) {
              this.daytosend = '*/' + i.toString();
            }
          }
      }
    }
    
    newCronExpression = `El Cron se ejecuta ${stringDay}, a las ${this.hour} horas ${this.minute} minutos`;
    return newCronExpression;
  }

  ngOnInit() {
   // this.getCron();
  }
  taskSelected() {
   
    this.showCronForm = true;
   
    this.changeCron.getCronByTask(this.selectTask).subscribe(
      (expression:any) => {
        if (expression.length > 0){
        this.cronExpression = expression;
        this.newCronExpression = this.translateCronExpression(expression,0);
       // console.log('Cron expression recibida de BD:', this.cronExpression);
        }
        else{
          this.resetInitialValues();
          //console.log('Cron expression recibida de BD es vacia.');
        }
      },
      (error) => {
       // console.error('Error al obtener la expresión cron', error);
      }

    );

  }
  resetInitialValues() {
    this.hour = 0;
    this.minute = 0;
    this.day = '';
    
  }
  prueba(){
    this.SynchroService.prueba(this.mailTo.toString()).subscribe({
      complete: () => {
        this.router.navigate(['/synchro']);
      }

    });
   
  }
  goSynchro(){
    this.router.navigate(['/synchro']);
  }
  showCron(){
    this.getCron();
    this.showCronForm = true;
    
  }
}
