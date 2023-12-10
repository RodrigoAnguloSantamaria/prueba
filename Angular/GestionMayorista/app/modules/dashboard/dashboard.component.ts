import { Component } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  isAdmin: boolean = false;

  constructor(private adminGuard: AuthService, private keycloak: KeycloakService) {
  }

  ngOnInit(): void {
    // const userRoles: string[] = this.adminGuard.getRoles();
    // console.log(userRoles);
    // console.log(userRoles.indexOf("Nomarca-front-admin"));

    // this.keycloak.loadUserProfile().then((user) => {console.log(user)});
    // const realmRoles = this.keycloak.getKeycloakInstance().tokenParsed?.realm_access?.roles;
    // console.log(JSON.stringify(realmRoles));

    // this.isAdmin = userRoles.indexOf("GA-frontend-admin") !== -1;
    // console.log(this.isAdmin);
  }
}
