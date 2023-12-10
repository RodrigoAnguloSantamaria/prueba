import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatOptionModule } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { MatTableExporterModule } from 'mat-table-exporter';
import { SharedModule } from '../shared/shared.module';
import { AccessDeniedComponent } from './access-denied/access-denied.component';
import { LoginComponent } from './login/login.component';
import { AddTaskComponent } from './pages/add-task/add-task.component';
import { DetailedInfoComponent } from './pages/detailed-info/detailed-info.component';
import { LineChartByDatesComponent } from './pages/detailed-info/line-chart-by-dates/line-chart-by-dates.component';
import { ForecastComponent } from './pages/forecast/forecast.component';
import { ProjectsChartsComponent } from './pages/forecast/projects-charts/projects-charts.component';
import { ProjectsTableComponent } from './pages/forecast/projects-table/projects-table.component';
import { HomeComponent } from './pages/home/home.component';
import { StatisticModule } from './pages/statistic/statistic.module';
import { TaskTableComponent } from './pages/task-table/task-table.component';
import { CallsComponent } from './pages/calls/calls.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ConfirmDialogComponent } from '../shared/components/confirm-dialog/confirm-dialog.component';
import { EventTableComponent } from './pages/event-table/event-table.component';
import { RouterModule } from '@angular/router';
import { FileTableComponent } from './pages/file-table/file-table.component';
import { FileFormComponent } from './pages/file-form/file-form.component';
import { CashTableComponent } from './pages/cash-table/cash-table.component';
import { CompanyTableComponent } from './pages/company-table/company-table.component';
import {MatTabsModule} from '@angular/material/tabs';
import { UserTableComponent } from './pages/user-table/user-table.component';
import { NewLoteComponent } from './pages/file-form/new-lote/new-lote.component';
import { NewTramiteComponent } from './pages/file-form/new-tramite/new-tramite.component';
import { CenterTableComponent } from './pages/center-table/center-table.component';
import { ConsultTableComponent } from './pages/consult-table/consult-table.component';
import { CashFormComponent } from './pages/cash-form/cash-form.component';

@NgModule({
  declarations: [
    LoginComponent,
    HomeComponent,
    AddTaskComponent,
    EventTableComponent,
    TaskTableComponent,
    FileTableComponent,
    ForecastComponent,
    ProjectsTableComponent,
    ProjectsChartsComponent,
    DetailedInfoComponent,
    LineChartByDatesComponent,
    AccessDeniedComponent,
    CallsComponent,
    FileFormComponent,
    CashTableComponent,
    CompanyTableComponent,
    UserTableComponent,
    NewLoteComponent,
    NewTramiteComponent,
    CenterTableComponent,
    ConsultTableComponent,
    CashFormComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    StatisticModule,

    NgxChartsModule,
    MatSelectModule,
    MatOptionModule,
    MatButtonToggleModule,
    MatTableExporterModule,
    RouterModule,
    MatCardModule,
    MatCheckboxModule,
    MatTooltipModule,
    MatIconModule,
    MatFormFieldModule,
    MatPaginatorModule,
    MatInputModule,
    MatTableModule,
    MatButtonModule,
    MatPaginatorModule,
    MatSortModule,
    MatDialogModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    MatSnackBarModule,
    ConfirmDialogComponent,
    MatSnackBarModule,
    MatTabsModule
    // BrowserModule,
  ],
  exports: [LoginComponent],
  providers: [ConfirmDialogComponent],
})
export class ModulesModule {}
