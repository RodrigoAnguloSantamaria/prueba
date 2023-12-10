import {Injectable} from "@angular/core";
import {KeycloakService} from "keycloak-angular";

@Injectable({
  providedIn: "root"
})
export class  AuthService {

  constructor(private keycloakService: KeycloakService) { }

  public getUsername(): string {
    return this.keycloakService.getUsername();
  }

  public getRoles(): string [] {
    return this.keycloakService.getUserRoles();
  }

  public logout(): void {
    this.keycloakService.logout().then(() => this.keycloakService.clearToken());
  }

  // auth.service.ts

async getUserGroups(): Promise<string[]> {
  // Verificar si el usuario está autenticado
  if (await this.keycloakService.isLoggedIn()) {
    // Obtener el token de acceso del usuario
    const token = this.keycloakService.getKeycloakInstance().token;

    // Obtener y loguear los grupos del usuario desde el token decodificado
    const decodedToken: any = this.keycloakService.getKeycloakInstance().tokenParsed;

    // Acceder a las propiedades del token directamente
    const userGroups = decodedToken.realm_access?.roles || [];
    // console.log('Grupos del usuario:', userGroups);
    return userGroups;
  } else {
    // El usuario no está autenticado, devolver un array vacío o manejar según sea necesario
    return [];
  }
}


}
