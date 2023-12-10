import { IdToNamePipe } from "../pipes/id-to-name.pipe";


export let customTimeFormat = (val: number) => {
  var result: string = val.toLocaleString() + 'h';
  // console.log(result);
  return result;
}
export let customCostFormat = (val: number) => {
  var result: string = val.toLocaleString() + '€';
  // console.log(result);
  return result;
}
export let customNameFormat = (name: string) => {
  var result: string = new IdToNamePipe().transform(name);
  // console.log(result);
  return result;
}
