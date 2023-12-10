import { Component, Inject, Input, OnInit, Optional } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { WorkindDayFormService } from 'src/app/core/services/workind-day-form.service';
import { WorkingDayService } from '../../../core/http/working-day.http.service';
import { EWorkinDayFormAction } from '../../models/enums/WorkinDayFormAction.enum';
import { IWorkingDay } from '../../models/interfaces/WorkingDay.interface';
import { CustomDatePipe } from '../../pipes/customDate.pipe';



@Component({
  selector: 'app-working-day',
  templateUrl: './working-day.component.html',
  styleUrls: ['./working-day.component.css'],
  providers: [CustomDatePipe]
})
// TODO: se puede optimizar el tema de editar y añadir workingDays
export class WorkingDayComponent implements OnInit {
  private subscriptionFormAction$: Subscription = new Subscription();
  private subscriptionDataForm$: Subscription = new Subscription();

  createdWithDataToFillForm: boolean = false;
  actionBtn: string = "Guardar";
  // Tambien se utiliza desde add-task como soporte para rellenar el form por eso el @Input
  // Este elemneto es el que se envia para el backend
  workingDay: IWorkingDay = {
    id: "",
    workingDate: Math.floor(Date.now() / 1000),
    projectId: "",
    userId: "U001",
    taskTypeId: "",
    timeSpent: 0.0,
    taskCost: 0.0, // TODO: manejarlo en el backend
  };

  workingDayForm = this.fb.nonNullable.group({
    // id: '',
    projectId: ["", [Validators.required]],
    userId: "U001",
    taskTypeId: ["", [Validators.required]],
    workingDate: [new Date().toISOString().substring(0, 10)],
    timeSpent: [0, [Validators.required, Validators.pattern("[12345678]$")]],
  });

  // ToDo: sacar ids de proyectos y categorias de la base de datos y mostrar nombre real no ids
  // tasks: string[] = ["Programar", "Documentar", "Diseñar", "Reunion", "Vaciones"];
  tasks: string[] = ["T001", "T002", "T003", "T004", "T005", "T006", "T007", "T008", "T009", "T010", "T011", "T012", "T013", "T014", "T015", "T016", "T017", "T018", "T019", "T020", "T021", "T022", "T023", "T024", "T025", "T026", "T027", "T028", "T029", "T030"];
  projects: string[] = ["P001", "P002", "P003", "P004", "P005", "P006", "P007", "P008", "P009", "P010", "P011", "P012", "P013", "P014", "P015", "P016", "P017", "P018", "P019", "P020", "P021", "P022", "P023", "P024", "P025", "P026", "P027", "P028", "P029", "P030"];

  // Recibimos los datos que nos envia el componente padre en editData
  constructor(
    private fb: FormBuilder,
    private customDatePipe: CustomDatePipe,
    private workingDayService: WorkingDayService,
    private workindDayFormService: WorkindDayFormService,
    private snackBar: MatSnackBar,
  ) { }

  ngOnInit(): void {
    // this.getAll();
    this.subscriptionFormAction$ = this.workindDayFormService.getWorkinDayFormActionObservable().subscribe((action: EWorkinDayFormAction) => this.actionBtn = action)
    this.subscriptionDataForm$ = this.workindDayFormService.getWorkingDayDataFormObservable().subscribe((wd: IWorkingDay) => {
      this.workingDayForm.setValue({
        projectId: wd.projectId,
        userId: wd.userId,
        taskTypeId: wd.taskTypeId,
        workingDate: this.customDatePipe.transformUnixToISO(wd.workingDate),
        timeSpent: wd.timeSpent,
      });
      this.workingDay = {
        id: wd.id,
        workingDate: wd.workingDate,
        userId: wd.userId,
        projectId: wd.projectId,
        taskTypeId: wd.taskTypeId,
        timeSpent: wd.timeSpent,
        taskCost: wd.taskCost * 20,
      };
    })
  }
  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.subscriptionFormAction$.unsubscribe();
    this.subscriptionDataForm$.unsubscribe();
  }

  public fillWorkingDay() {
    this.workingDayForm.setValue({
      projectId: this.workingDay.projectId,
      userId: this.workingDay.userId,
      taskTypeId: this.workingDay.taskTypeId,
      workingDate: this.customDatePipe.transformUnixToISO(this.workingDay.workingDate),
      timeSpent: this.workingDay.timeSpent,
    });
  }
  create(): void {
    console.log(this.workingDay);
    // Modificamos los valores que cambie el user en el form y el resto de datos los dejamos como estaban
    this.workingDay = {
      id: this.workingDay.id,
      workingDate: this.customDatePipe.transformISOToUnix(this.workingDayForm.value.workingDate),
      projectId: this.workingDayForm.value.projectId || this.workingDay.projectId,
      taskTypeId: this.workingDayForm.value.taskTypeId || this.workingDay.taskTypeId,
      userId: this.workingDayForm.value.userId || this.workingDay.userId,
      timeSpent: this.workingDayForm.value.timeSpent || this.workingDay.timeSpent,
      taskCost: this.workingDay.taskCost,
    }
    if (this.actionBtn === "Editar") { // Queremos editar un dato
      console.log(this.workingDay);
      this.workingDayService.update(this.workingDay.id, this.workingDay)
        .subscribe(
        // () => this.getAll()
      );

      this.snackBar.open('Jornada editada correctamente!', 'Ok', { duration: 2000 })
      location.reload();

    } else {// Queremos añadir un dato nuevo
      // Hacemos la peticion post
      this.workingDayService.create(this.workingDay)
        .subscribe(
        // () => this.getAll()
      );
      this.snackBar.open('Jornada creada correctamente!', 'Ok', { duration: 2000 });
      location.reload();
    }
  }

  // update(id: string) {
  //   this.workingDayService.update(id, this.editData).subscribe();
  // }

  // delete(id: string, taskId: string) {
  //   this.workingDayService.delete(id, taskId).subscribe();
  // }

  // getPovisionalTaskCost(): number {
  //   this.workingDay.taskCost = this.workingDay.timeSpent * 20
  //   return this.workingDay.taskCost
  // }

}
