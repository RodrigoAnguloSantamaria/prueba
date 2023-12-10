import { ISimpleData } from "./SimpleData.interface";

export interface IDataForPrintComponents {
  cardTitle: string,
  cardText: string,
  chartTotalLabel: string,
  chatNameFormatting: (name: string) => any,
  chatValueFormatting: (value: number) => any,
  tooltipNameType: string,
  tooltipValueType: string,
  data: ISimpleData[],
}
