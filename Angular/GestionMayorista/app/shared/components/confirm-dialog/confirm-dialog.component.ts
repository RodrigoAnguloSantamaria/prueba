import { IConfirmDialogData } from 'src/app/shared/models/interfaces/ConfirmDialogData.interface';
import { Component, Inject, OnInit } from '@angular/core';

import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatCommonModule } from '@angular/material/core';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.scss'],
  standalone: true,
  imports: [MatIconModule, MatDialogModule, MatCommonModule, MatSnackBarModule, CommonModule]
  
})
export class ConfirmDialogComponent implements OnInit {
  type: string = '';

  constructor(@Inject(MAT_DIALOG_DATA) public data: IConfirmDialogData) {}

  ngOnInit(): void {
    // Valores predeterminados de los botones
    // this.data.confirmCaption = this.data.confirmCaption || 'Confirmar';
    // this.data.cancelCaption = this.data.cancelCaption || 'Cancelar';
    // this.type = this.data.type || '';
  }

  copyToClipboard(text: string) {
    navigator.clipboard.writeText(text);
  }
}
