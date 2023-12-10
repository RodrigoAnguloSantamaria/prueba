import { Component, Input, OnInit } from '@angular/core';
import { CustomDatePipe } from '../../pipes/customDate.pipe';
import { IdToNamePipe } from '../../pipes/id-to-name.pipe';
import { ThousandsPipe } from '../../pipes/thousands.pipe';

@Component({
  selector: 'app-custom-chart-tooltip',
  templateUrl: './custom-chart-tooltip.component.html',
  styleUrls: ['./custom-chart-tooltip.component.css'],
  providers: [
    IdToNamePipe,
    ThousandsPipe
  ]
})
export class CustomChartTooltipComponent implements OnInit {

  @Input() name: string = '';
  @Input() value: string = '';
  @Input() nameType: string = '';
  @Input() valueType: string = '';
  @Input() typeOfData: string = 'simple'; // Si es series mostrar fecha
  @Input() seriesDate: number  = 0; // Si es seriesDate
  @Input() seriesId: string  = ''; // Si es seriesId

  nameId: string = '';
  realName: string = '';
  valueString: string = '';


  constructor(
    private idToNamePipe: IdToNamePipe,
    private thousandsPipe :ThousandsPipe
  ) { }

  ngOnInit(): void {

    this.nameId = this.name;
    //ID a nombre real
    this.realName = this.idToNamePipe.transform(this.name);
    // console.error('ERROR: ' + this.nameType + '. Tipo de valor invalido tiene que se projectId, userId o taskTypeId');

    //Formato en hora o euros del valor
    if (this.valueType === 'taskCost') this.valueString = this.thousandsPipe.transform(this.value) + '€';
    else if (this.valueType === 'timeSpent') this.valueString = this.thousandsPipe.transform(this.value) + 'h';
    else
      console.error('ERROR: ' + this.valueType + '. Tipo de valor invalido tiene que se timeSpent o taskCost');

    // console.log(
    //   "nameId: " + this.nameId +
    //   "\nrealName: " + this.realName +
    //   "\nvalueString: " + this.valueString
    // );
  }

}
