export const environment = {
  production: false,
  configurationMessage: 'The configuration is: test',
  currentBuildVersion: import.meta.env['NG_APP_TST_VERSION'],

  firebaseConfig: {
    apiKey: import.meta.env['NG_APP_TST_FIREBASE_API_KEY'],
    authDomain: import.meta.env['NG_APP_TST_FIREBASE_AUTH_DOMAIN'],
    projectId: import.meta.env['NG_APP_TST_FIREBASE_PROJECT_ID'],
    storageBucket: import.meta.env['NG_APP_TST_FIREBASE_STORAGE_BUCKET'],
    messagingSenderId: import.meta.env[
      'NG_APP_TST_FIREBASE_MESSAGING_SENDER_ID'
    ],
    appId: import.meta.env['NG_APP_TST_FIREBASE_APP_ID'],
  },
};
