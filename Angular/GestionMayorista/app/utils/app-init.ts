import { KeycloakService } from "keycloak-angular";
import { environment } from "../../environments/environment";

export function initializer(keycloak: KeycloakService): () => Promise<any> {
  return (): Promise<any> => {
    return new Promise(async (resolve, reject) => {
      try {
        await keycloak.init({
          config: {
            url: environment.keycloak.issuer,
            realm: environment.keycloak.realm,
            clientId: environment.keycloak.clientId,
          },
          // If set a false you cannot get any information about the user (e.g. username)
          loadUserProfileAtStartUp: true,
          initOptions: {
            onLoad: 'login-required',
            checkLoginIframe: true,
            silentCheckSsoRedirectUri: window.location.origin + '/assets/silent-check-sso.html',
          },
          // shouldAddToken: (request) => {
          //   const { method, url } = request;

          //   const isGetRequest = 'GET' === method.toUpperCase();
          //   const acceptablePaths = ['/assets', '/clients/public'];
          //   const isAcceptablePathMatch = urls.some((path) => url.includes(path));

          //   return !(isGetRequest && isAcceptablePathMatch);
          // }
          // By default, the keycloak-angular library add 'Authorization: Bearer TOKEN' header to all http requests
          // Add here if u want to exclude urls (to not have that header)
          // bearerExcludedUrls: ['/']
        });

        resolve(resolve);
      } catch (err) {
        reject(err);
      }
    });
  };

}
