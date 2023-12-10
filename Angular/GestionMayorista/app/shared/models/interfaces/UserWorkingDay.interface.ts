export interface IUserWorkingDay {
  id: string;
  workingDate: number;
  workingDayDataList: IUserWorkingDayDataList[]

}
export interface IUserWorkingDayDataList{
  projectId: string;
  taskId: string;
  userId: string;
  timeSpent: number;
}




