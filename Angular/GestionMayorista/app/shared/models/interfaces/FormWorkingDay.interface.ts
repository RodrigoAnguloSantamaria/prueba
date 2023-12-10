import { FormControl } from "@angular/forms";

export interface IFormWorkingDay {
  // id: FormControl<string>;
  projectId: FormControl<string>;
  userId: FormControl<string>;
  taskTypeId: FormControl<string>;
  workingDate: FormControl<number>;
  timeSpent: FormControl<number>;
  taskCost: FormControl<number>;
}




