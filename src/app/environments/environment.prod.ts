export const environment = {
  production: true,
  apiUrl: window.location.origin + '/',
  serviceUrl: 'http://prod-api.adsprod.p.azurewebsites.net/',
  adalConfig: {
    tenant: 'adswastewater.onmicrosoft.com',
    clientId: '6b3c3863-2d40-4328-8bd8-9f65a21980ab',
    redirectUri: window.location.origin + '/',
    postLogoutRedirectUri: window.location.origin + '/'
  },
  mapApiKey: 'AIzaSyC5GHO1TzUgW818xd_KJ7mnGZmFiJSecKU',
  showOnlyCrowdcore: false
};
