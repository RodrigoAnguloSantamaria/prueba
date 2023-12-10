export const environment = {
  production: true,
  keycloak: {
    // Keycloak url
    issuer: 'http://172.22.24.7:8180',
    // issuer: 'http://172.22.24.7:8180/realms/SpringBoot-Angular-Keycloak',
    // Realm
    realm: 'SpringBoot-Angular-Keycloak',
    clientId: 'GA-frontend'
  },
};
