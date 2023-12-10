import { id } from '@swimlane/ngx-charts';
import { ChatbotServiceService } from './../../chatbot-services/chatbot-service.service';
import { Component, Inject, OnInit, NgModule, Input } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { CommonModule, NgIf } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTooltipModule } from '@angular/material/tooltip';



@Component({
  selector: 'app-save-button',
  templateUrl: './save-button.component.html',
  styleUrls: ['./save-button.component.css'],
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatDialogModule,
    CommonModule,
    NgIf,
    MatTooltipModule
  ],
})
export class DialogOverviewExample {
  @Input() actualTitle!: string;
  _actualTitle: string = '';
  title: string = '';
  enableSaveBtn: boolean = false;
  conversationNumber: number = 0;

  constructor(public dialog: MatDialog, private chabotService: ChatbotServiceService) {


    this.chabotService.conversationNumber$.subscribe((number) => {
      this.conversationNumber = number;
    });

    this._actualTitle = this.chabotService.fullConversation.title;
    //console.log("conversation number en la clase " + this.conversationNumber);
    if (this.conversationNumber >= 5) {
      if (!this._actualTitle) {
        this.enableSaveBtn = true;
      } else {
        this.enableSaveBtn = false;
      }
    } else {
      this.enableSaveBtn = false;
    }

  }


  saveConversation(): void {
    if (this.chabotService.fullConversation.title) {

      this.chabotService.sendConversation();
      return;
    }
    const dialogRef = this.dialog.open(DialogOverviewExampleDialog,{data:{conversationNumber:this.conversationNumber, title:this._actualTitle}});

    dialogRef.afterClosed().subscribe(result => {
      // console.log('The dialog was closed', result);
      result = result.trim();
      if (!result) {
        console.log('no title', result);

      } else {
        this.chabotService.fullConversation.title = result;
        //console.log(this.chabotService.fullConversation);
        this.chabotService.sendConversation();
      }
    });
  }
}

@Component({
  selector: 'save-button-dialog',
  templateUrl: 'save-button-dialog.html',
  standalone: true,
  imports: [MatDialogModule, MatFormFieldModule, MatInputModule, FormsModule, MatButtonModule, CommonModule, NgIf],
})
export class DialogOverviewExampleDialog {
  maxTitleLength: boolean = false;
  enableSaveBtn: boolean = true;
  title: string = '';



  constructor(
    public dialogRef: MatDialogRef<DialogOverviewExampleDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any,
   )
   {
    if (!data.title ) {
      if (data.conversationNumber < 5) {
        if(this.title.length>0){
           this.enableSaveBtn=false;
        }
      }
      else{
        this.enableSaveBtn=true;
      }
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  limitLength(event: any) {
    if (event.target.value.length == 20) {
      this.maxTitleLength = true;

    }
    else {
      event.target.value == 0 ? this.enableSaveBtn = true : this.enableSaveBtn = false;
      this.maxTitleLength = false;
    }
  }

}
