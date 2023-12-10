import { Component, OnInit, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ChatbotComponent } from '../../chatbot.component';
import { NgIf } from '@angular/common';
import { DialogOverviewExampleDialog } from '../save-button/save-button.component';

@Component({
  selector: 'app-delete-confirmation',
  templateUrl: './delete-confirmation.component.html',
  styleUrls: ['./delete-confirmation.component.css'],
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    NgIf,
    MatDialogModule,
    ChatbotComponent
  ],
  providers: [DialogOverviewExampleDialog]
})
export class DeleteConfirmationComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<DeleteConfirmationComponent>
) {}

  ngOnInit() {
  }

  onNoClick(): void {
    this.dialogRef.close('cancelar');
  }

  onYesClick(): void {
    this.dialogRef.close('confirmar');
  }

}
