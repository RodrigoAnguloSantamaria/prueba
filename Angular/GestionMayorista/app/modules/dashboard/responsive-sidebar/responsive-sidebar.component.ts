import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { NgIfContext } from '@angular/common';
import { Component, HostListener, TemplateRef, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { AuthService } from 'src/app/core/services/auth.service';
@Component({
  selector: 'app-responsive-sidebar',
  templateUrl: './responsive-sidebar.component.html',
  styleUrls: ['./responsive-sidebar.component.scss']
})
export class ResponsiveSidebarComponent {
  public anchoViewport: number;
  private userRoles: string[];
  isExpanded: boolean = false;
  sidebarItemsList: ISidebarItem[] = [
    {
      title: 'Home',
      icon: 'bi-house',
      route: 'home',
      accessRole: 'Nomarca-front-user',
    },
    // {
    //   title: 'Añadir tarea',
    //   icon: 'bi-plus',
    //   route: 'add',
    //   accessRole: 'GA-frontend-user',
    // },
    {
      title: 'Gestión',
      icon: 'bi-kanban',
      route: '',
      accessRole: 'Nomarca-front-user',
      children: [
        {
          title: 'Expedientes',
          icon: 'bi-clipboard2-data',
          route: 'file-table'
        },
        {
          title: 'Anticipos Caja',
          icon: 'bi-cash',
          route: 'cash-table'
        },
        {
          title: 'Empresas',
          icon: 'bi-building-check',
          route: 'company-table'
        }

      ]
    },
    {
      title: 'Consulta',
      icon: 'bi-question-octagon',
      route: '',
      accessRole: 'Nomarca-front-user',
      children: [
        {
          title: 'Económica',
          icon: 'bi-wallet',
          route: ''
        },
        {
          title: 'Eco-Fichas',
          icon: 'bi-wallet-fill',
          route: ''
        },
        {
          title: 'Carga Automática Comprometido',
          icon: 'bi-arrow-clockwise',
          route: 'consult-table'
        }

      ]
    },
    {
      title: 'Asignaciónes centro de gasto',
      icon: 'bi-currency-euro',
      route: '',
      accessRole:'Nomarca-front-user',
    },
    {
      title: 'Generación de crédito',
      icon: 'bi-r-square',
      route: '',
      accessRole: 'Nomarca-front-user',
    },
    {
      title: 'Informes - Expedientes',
      icon: 'bi-filetype-pdf',
      route: '',
      accessRole: 'Nomarca-front-user',
    },
    {
      title: 'Documentos contables',
      icon: 'bi bi-file-text',
      route: '',
      accessRole: 'Nomarca-front-user',
    },
    {
      title: 'Administrador',
      icon: 'bi-person-circle',
      route: '',
      accessRole: 'Nomarca-front-admin',
      children: [
        {
          title: 'Gestión usuarios',
          icon: 'bi-people',
          route: 'user-table'
        },
        {
          title: 'Gestión Centros de Gasto',
          icon: 'bi-currency-euro',
          route: 'center-table'
        },
        {
          title: 'Tablas',
          icon: 'bi-table',
          route: ''
        },
        {
          title: 'Automatización Procesos',
          icon: 'bi-clock-history',
          route: 'updateCron'
        }
      ]
    }
    // {
    //   title: 'Forecast',
    //   icon: 'bi-kanban',
    //   route: 'forecast',
    //   accessRole: 'GA-frontend-admin',
    // },
  ];
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

@ViewChild('childrenBlock', {static: true}) childrenBlock: TemplateRef<ISidebarItem>|null = null;
@ViewChild('singleBlock', {static: true}) singleBlock: TemplateRef<ISidebarItem>|null = null;

  constructor(private breakpointObserver: BreakpointObserver, private authService: AuthService) {
    this.userRoles = this.authService.getRoles();
    this.anchoViewport = window.innerWidth

  }

  hasAccess(role: string): boolean {
    return this.userRoles.includes(role);
  }

  // Este método se ejecutará cada vez que cambie el ancho del viewport
  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    // Actualiza el ancho del viewport cuando cambia
    this.anchoViewport = window.innerWidth;
    this.anchoViewport < 900 ? this.isExpanded = true : this.isExpanded = false;

  }
}
interface ISidebarItem {
  title: string,
  icon: string,
  route: string,
  accessRole: string,
  children?: IchildrenItem[]
}
interface IchildrenItem{
  title: string,
  icon: string,
  route: string
}

