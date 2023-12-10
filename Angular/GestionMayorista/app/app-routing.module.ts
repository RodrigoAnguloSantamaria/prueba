import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { AccessDeniedComponent } from './modules/access-denied/access-denied.component';
import { DashboardComponent } from './modules/dashboard/dashboard.component';
import { AddTaskComponent } from './modules/pages/add-task/add-task.component';
import { DetailedInfoComponent } from './modules/pages/detailed-info/detailed-info.component';
import { ForecastComponent } from './modules/pages/forecast/forecast.component';
import { HomeComponent } from './modules/pages/home/home.component';
import { StatisticComponent } from './modules/pages/statistic/statistic.component';
import { TaskTableComponent } from './modules/pages/task-table/task-table.component';
import { CallsComponent } from './modules/pages/calls/calls.component';
import { SynchroComponent } from './shared/components/synchro/synchro.component';
import { ChangeCronComponent } from './shared/components/change-cron/change-cron.component';
import { EventTableComponent } from './modules/pages/event-table/event-table.component';
import { FileTableComponent } from './modules/pages/file-table/file-table.component';
import { FileFormComponent } from './modules/pages/file-form/file-form.component';
import { CashTableComponent } from './modules/pages/cash-table/cash-table.component';
import { CompanyTableComponent } from './modules/pages/company-table/company-table.component';
import { UserTableComponent } from './modules/pages/user-table/user-table.component';
import { CenterTableComponent } from './modules/pages/center-table/center-table.component';
import { ConsultTableComponent } from './modules/pages/consult-table/consult-table.component';
import { CashFormComponent } from './modules/pages/cash-form/cash-form.component';


const routes: Routes = [

  {
    path: '',
    canActivate: [AuthGuard],
    data: { requiredRoles: ['Nomarca-front-user'] },
    children: [
      {
        path: 'access-denied',
        component: AccessDeniedComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'home',
        component: HomeComponent,
        title: 'Home',
        canActivate: [AuthGuard],
        data: { requiredRoles: ['Nomarca-front-user'] },
      },
      {
        path: 'add',
        component: AddTaskComponent,
        title: 'Añadir Jornada',
        canActivate: [AuthGuard],
        data: { requiredRoles: ['Nomarca-front-user'] },
      },
      {
        path: 'calls',
        component: CallsComponent,
        title: 'Llamadas',
        canActivate: [AuthGuard],
        data: { requiredRoles: ['Nomarca-front-user'] },
      },
      {
        path: 'synchro',
        component: SynchroComponent,
        title: 'Sincro',
        canActivate: [AuthGuard],
        data: { requiredRoles: ['Nomarca-front-admin'] },
      },
      {
        path: 'updateCron',
        component: ChangeCronComponent,
        title: 'Cron',
        canActivate: [AuthGuard],
        data: { requiredRoles: ['Nomarca-front-admin'] },
      },
      {
        path: 'message-table',
        component: TaskTableComponent,
        title: 'Mensajes',
        canActivate: [AuthGuard],
        data: { requiredRoles: ['Nomarca-front-user'] },
      },
      {
        path: 'statistic',
        component: StatisticComponent,
        title: 'Estadisticas',
        canActivate: [AuthGuard],
        data: { requiredRoles: ['GA-frontend-manager'] },
      },
      {
        path: 'detailedInfo',
        component: DetailedInfoComponent,
        title: 'Informacion Detallada',
        canActivate: [AuthGuard],
        data: { requiredRoles: ['GA-frontend-manager'] },
      },
      {
        path: 'forecast',
        component: ForecastComponent,
        title: 'Forecast',
        canActivate: [AuthGuard],
        data: { requiredRoles: ['GA-frontend-admin'] },
      },
      {
        path: 'event-table',
        component: EventTableComponent,
        title: 'Eventos en seguimiento',
        canActivate: [AuthGuard],
        data: { requiredRoles: ['Nomarca-front-user'] },
      },
      {
        path: 'file-table',
        component: FileTableComponent,
        title: 'Listado de Expedientes',
        canActivate: [AuthGuard],
        data: { requiredRoles: ['Nomarca-front-user'] },
      },
      {
        path: 'file-form',
        component: FileFormComponent,
        title: 'Formulario de Expedientes',
        canActivate: [AuthGuard],
        data: { requiredRoles: ['Nomarca-front-user'] },
      },
      {
        path: 'cash-table',
        component: CashTableComponent,
        title: 'Gestión Anticipos',
        canActivate: [AuthGuard],
        data: { requiredRoles: ['Nomarca-front-user'] },
      },
      {
        path: 'cash-form',
        component: CashFormComponent,
        title: 'Formulario Anticipos',
        canActivate: [AuthGuard],
        data: { requiredRoles: ['Nomarca-front-user'] },
      },
      {
        path: 'company-table',
        component: CompanyTableComponent,
        title: 'Empresas',
        canActivate: [AuthGuard],
        data: { requiredRoles: ['Nomarca-front-user'] },
      },
      {
        path: 'user-table',
        component: UserTableComponent,
        title: 'Usuarios',
        canActivate: [AuthGuard],
        data: { requiredRoles: ['Nomarca-front-admin'] },
      },
      {
        path: 'center-table',
        component: CenterTableComponent,
        title: 'Centros',
        canActivate: [AuthGuard],
        data: { requiredRoles: ['Nomarca-front-admin'] },
      },
      {
        path: 'consult-table',
        component: ConsultTableComponent,
        title: 'Consultas',
        canActivate: [AuthGuard],
        data: { requiredRoles: ['Nomarca-front-user'] },
      },
      {
        path: '**',
        redirectTo: "home"
      }
    ],
    component: DashboardComponent,
  },
  {
    path: '**',
    redirectTo: 'login',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
