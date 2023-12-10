import { Component, OnInit } from '@angular/core';
import { WorkingDayService } from 'src/app/core/http/working-day.http.service';
import { WorkindDayFormService } from 'src/app/core/services/workind-day-form.service';
import { EWorkinDayFormAction } from 'src/app/shared/models/enums/WorkinDayFormAction.enum';
import { IUserWorkingDay, IUserWorkingDayDataList } from 'src/app/shared/models/interfaces/UserWorkingDay.interface';
import { IWorkingDay } from 'src/app/shared/models/interfaces/WorkingDay.interface';

@Component({
  selector: 'app-add-task',
  templateUrl: './add-task.component.html',
  styleUrls: ['./add-task.component.css']
})
export class AddTaskComponent implements OnInit {

  userId: string = 'U003'
  weeklyWorkingday: IUserWorkingDay[] = [];
  workingDay: IWorkingDay = {
    id: "",
    workingDate: 0,
    projectId: "",
    userId: "U001",
    taskTypeId: "",
    timeSpent: 0.0,
    taskCost: 0.0,
  };
  constructor(
    private workingDayService: WorkingDayService,
    private workindDayFormService: WorkindDayFormService
  ) { }

  ngOnInit(): void {
    this.workingDayService.getUserWeeklyWorkingday(this.userId).subscribe((data: any[]) => {
      console.log(data);
      this.weeklyWorkingday = data;
      console.log(this.weeklyWorkingday);
    });
  }
  getTotalTimePerDay(day: number): number {
    const findedDay: IUserWorkingDay | undefined = this.weeklyWorkingday.find(wd => wd.workingDate === day);
    let result: number = 0;
    if (findedDay) {
      findedDay.workingDayDataList.forEach(element => {
        result += element.timeSpent;
      });
    }
    return result;
  }

  addSameTask(workingDayData: IUserWorkingDayDataList) {
    const workingDayToEdit: IWorkingDay = {
      id: "", //Asignar en el backend
      workingDate: this.weeklyWorkingday[0].workingDate,
      projectId: workingDayData.projectId,
      userId: workingDayData.userId,
      taskTypeId: workingDayData.taskId.substring(8, 12),
      timeSpent: workingDayData.timeSpent,
      taskCost: 0, //Asignar en el backend
    }
    this.workindDayFormService.setWorkinDayFormActionObservable(EWorkinDayFormAction.ADD);
    this.workindDayFormService.setWorkingDayDataFormObservable(workingDayToEdit);

  }
  editTask(id: string, date: number, workingDayData: IUserWorkingDayDataList) {
    const workingDayToEdit: IWorkingDay = {
      id: id,
      workingDate: date,
      projectId: workingDayData.projectId,
      userId: workingDayData.userId,
      taskTypeId: workingDayData.taskId.substring(8, 12),
      timeSpent: workingDayData.timeSpent,
      taskCost: 0, //Asignar en el backend
    }
    this.workindDayFormService.setWorkinDayFormActionObservable(EWorkinDayFormAction.EDIT);
    this.workindDayFormService.setWorkingDayDataFormObservable(workingDayToEdit);
  }

}
