
import { ChatbotServiceService } from './../../chatbot-services/chatbot-service.service';
import { Component, Inject, ViewChild } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { NgIf } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ChatbotComponent } from '../../chatbot.component';
import { DialogOverviewExample, DialogOverviewExampleDialog } from '../save-button/save-button.component';
import { MatTooltipModule } from '@angular/material/tooltip';



@Component({
  selector: 'app-new-chat-button',
  templateUrl: './new-chat-button.component.html',
  styleUrls: ['./new-chat-button.component.css'],
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    NgIf,
    MatDialogModule,
    ChatbotComponent,
    MatTooltipModule
  ],
  providers: [DialogOverviewExampleDialog]
})
export class newDialogOverviewExample {
conversationNumber!: number;
  constructor(public dialog: MatDialog, private chabotService: ChatbotServiceService,) {

    this.chabotService.conversationNumber$.subscribe((number) => {
      this.conversationNumber = number;
    

    });

   
  }

  newConversation(): void {
    const dialogRef = this.dialog.open(newChatDialog,{data:{conversationNumber:this.conversationNumber, actualTitle:this.chabotService.fullConversation.title}});

    dialogRef.afterClosed().subscribe(result => {
      
      if (result == 0){return}
      if (result == 1) {
        const dialogSave = this.dialog.open(DialogOverviewExampleDialog,{data:{conversationNumber:this.conversationNumber, title:this.chabotService.fullConversation.title}});
        dialogSave.afterClosed().subscribe(result => {
          if (!result) {
            console.log('no title', result);
          } else {
           
            this.chabotService.fullConversation.title = result;
            this.chabotService.sendConversation();

          }
          
          this.chabotService.cleanChat();
          this.chabotService.updateData(false);
        });
      }
      else {
        this.chabotService.cleanChat();
        this.chabotService.updateData(false);
      }


    });
  }
}

@Component({
  selector: 'app-new-button',
  templateUrl: 'new-button-dialog.html',
  standalone: true,
  imports: [MatDialogModule, MatFormFieldModule, MatInputModule, FormsModule, MatButtonModule, NgIf, MatTooltipModule],
})
export class newChatDialog {
enableYesBtn: boolean = false;
  constructor(
    public dialogRef: MatDialogRef<newChatDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private chabotService: ChatbotServiceService,
  ) { 
    if (this.data.conversationNumber >= 5) {
      if (this.data.actualTitle){
        this.enableYesBtn = false;
      }
      else{
          this.enableYesBtn = true; 
      }
      
    }
    
  }


  newCleanMessages() {
    this.chabotService.cleanChat();
  }

  onNoClick(): void {
    this.dialogRef.close();
    this.newCleanMessages();

  }
}
