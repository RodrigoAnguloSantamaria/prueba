import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { DashboardModule } from '../modules/dashboard/dashboard.module';
import { SharedComponentsModule } from './components/shared-components.module';
import { PipeModule } from './pipes/pipe.module';
import { ChatbotComponent } from './components/chatbot/chatbot.component';
import { MatIconModule } from '@angular/material/icon';
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';
import { SynchroComponent } from './components/synchro/synchro.component';





@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ChatbotComponent,
    ConfirmDialogComponent,
    SynchroComponent

  ],
  exports: [
    DashboardModule,
    SharedComponentsModule,
    PipeModule,
    MatIconModule

  ],

})
export class SharedModule { }
