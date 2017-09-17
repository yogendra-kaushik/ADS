export const environment = {
  production: false,
  apiUrl: 'http://dev-web.adsprod.p.azurewebsites.net/',
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
