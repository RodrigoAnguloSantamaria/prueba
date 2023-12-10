import { Component, OnInit } from '@angular/core';
import { MatTable } from '@angular/material/table';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

import { interval } from 'rxjs';
import { EDateTypeFormat } from 'src/app/shared/models/enums/DateTypeFormat.enum';
import { CustomDatePipe } from 'src/app/shared/pipes/customDate.pipe';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers: [CustomDatePipe, MatTable]
})
export class HomeComponent implements OnInit {
  currentDate!: string;
  // timeFromNow!: Observable<string>;

  constructor(
    private customDatePipe: CustomDatePipe
  ) { }

  ngOnInit(): void {
    

    this.currentDate = format(new Date(), "eeee, dd 'de' MMMM 'de' yyyy, HH:mm:ss", {
      locale: es
    });
    interval(60000).subscribe(() => {
      this.currentDate = format(new Date(), "eeee, dd 'de' MMMM 'de' yyyy, HH:mm:ss", {
        locale: es
      });
    });
  }

}
