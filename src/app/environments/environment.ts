// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `angular-cli.json`.

export const environment = {
  production: false,
  apiUrl: 'http://localhost:4200/',
  serviceUrl: 'http://dev-api.adsprod.p.azurewebsites.net/',
  adalConfig: {
    tenant: 'adswastewater.onmicrosoft.com',
    clientId: '6b3c3863-2d40-4328-8bd8-9f65a21980ab',
    redirectUri: window.location.origin + '/',
    postLogoutRedirectUri: window.location.origin + '/'
  },
  mapApiKey: 'AIzaSyC5GHO1TzUgW818xd_KJ7mnGZmFiJSecKU',
  showOnlyCrowdcore: false

};
