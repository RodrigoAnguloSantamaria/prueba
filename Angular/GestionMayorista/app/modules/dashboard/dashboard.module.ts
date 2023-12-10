import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { DashToolbarComponent } from './dash-toolbar/dash-toolbar.component';
import { DashboardComponent } from './dashboard.component';
//  TODO Importaciones
import { LayoutModule } from '@angular/cdk/layout';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { MatExpansionModule } from '@angular/material/expansion';
import { ResponsiveSidebarComponent } from './responsive-sidebar/responsive-sidebar.component';
import { ChatbotComponent } from 'src/app/shared/components/chatbot/chatbot.component';





@NgModule({
  declarations: [
    DashboardComponent,
    DashToolbarComponent,
    ResponsiveSidebarComponent,

  ],
  imports: [
    CommonModule,
    MatFormFieldModule,
    FormsModule,
    AppRoutingModule,

    BrowserModule,
    BrowserAnimationsModule,
    MatSidenavModule,
    MatButtonModule,
    MatToolbarModule,
    MatIconModule,
    MatListModule,
    LayoutModule,
    ChatbotComponent,
    MatExpansionModule,
    FormsModule

  ],
  exports: [
    DashboardComponent,
  ]
})
export class DashboardModule { }
