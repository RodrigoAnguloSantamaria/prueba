import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable} from 'rxjs';
import { IProjectInfo } from 'src/app/shared/models/interfaces/ProjectInfo.interface';
@Injectable({
  providedIn: 'root'
})
export class ProjectsInfoService {
  private _projectsObservable: BehaviorSubject<IProjectInfo[]> = new BehaviorSubject<IProjectInfo[]>([{
    // Datos default
    projectId:'',
    estimatedCost: 0,
    estimatedTimeSpent:0,
    realCost:0,
    realTimeSpent:0,
  }]);
  private _projectsDataTableObservable: BehaviorSubject<IProjectInfo[]> = new BehaviorSubject<IProjectInfo[]>([{
    // Datos default
    projectId:'',
    estimatedCost: 0,
    estimatedTimeSpent:0,
    realCost:0,
    realTimeSpent:0,
  }]);

  getProjectsInfoObservable(): Observable<IProjectInfo[]>{
    return this._projectsObservable.asObservable();
  }

  setProjectsInfoObservable(data: IProjectInfo[]){
    this._projectsObservable.next(data);
  }

  getProjectsDataTableObservable(): Observable<IProjectInfo[]>{
    return this._projectsDataTableObservable.asObservable();
  }

  setProjectsDataTableObservable(data: IProjectInfo[]){
    this._projectsDataTableObservable.next(data);
  }

}
