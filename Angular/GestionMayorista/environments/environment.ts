// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  // apiUrl: '/api',

  //LLM IA url
  URL: 'http://172.22.24.6:8000/aimodel',
  BACKEND_URL: 'http://localhost:8080/chatbot/message',

  // CALLS ENDPOINT
  CALLS_URL:'http://localhost:8080/operations',

  // NOMARCA ENDPOINTS
  NOMARCA_URL: 'http://localhost:8080/nomarca',


  // const baseUrlChart = 'http://172.22.24.7:8080/chart';
  baseUrlChart: 'http://localhost:8080/chart',

  // const baseUrlPlane = 'http://172.22.24.7:8080/workingDay/plane/';
  // const baseUrlDB = 'http://172.22.24.7:8080/workingDay/';
  baseUrlPlane: 'http://localhost:8080/workingDay/plane/',
  baseUrlDB: 'http://localhost:8080/workingDay/',

  //localhost:8080/chatbot
  apiUrl: 'http://localhost:8080/chatbot',
  keycloak: {
    // Keycloak url
    issuer: 'http://localhost:8180',
    // issuer: 'http://172.22.24.7:8180',
    //issuer: 'http://172.22.24.7:8180/realms/SpringBoot-Angular-Keycloak',
    // Realm
    // realm: 'SpringBoot-Angular-Keycloak',
    realm: 'NoMarca',
    clientId: 'Nomarca-front',
  },
  //baseUrl: nomarca
  noMarcaUrl: 'http://localhost:8080/nomarca/',
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
