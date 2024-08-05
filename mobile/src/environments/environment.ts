// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  useEmulators: true,
  production: false,
  apiURL: 'http://127.0.0.1:5001/ai-for-impact-solifood-ca41a/us-central1/api',
  searchAPI: 'https://search-api.com',
  firebaseConfig: {
    apiKey: 'AIzaSyB3K6JCnio9Kx8ZX4XpVzTemS3_iubqb1E',
    authDomain: 'ai-for-impact-solifood-ca41a.firebaseapp.com',
    projectId: 'ai-for-impact-solifood-ca41a',
    storageBucket: 'ai-for-impact-solifood-ca41a.appspot.com',
    messagingSenderId: '401213418462',
    appId: '1:401213418462:web:16323661d1421cac3c0b4f',
  },
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
