import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IAnualData } from 'src/app/shared/components/confirm-dialog/show-confirm-dialog.service';
import { IConfirmDialogData } from 'src/app/shared/models/interfaces/ConfirmDialogData.interface';

@Component({
  selector: 'app-new-lote',
  templateUrl: './new-lote.component.html',
  styleUrls: ['./new-lote.component.css']
})
export class NewLoteComponent implements OnInit {
  anualForm!: FormGroup;

    constructor(@Inject(MAT_DIALOG_DATA) public data: IAnualData,
    
    private fb:FormBuilder ) {
    this.anualForm = this.fb.group({
    year:[0],
    unidades:[data.unidades || 0],
    importe:[data.importe || 0],
    year2:[0],
    unidades2:[0],
    importe2:[0]
     
      
    });
  }
  ngOnInit(): void {
  }
 


}
