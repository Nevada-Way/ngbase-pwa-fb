export const environment = {
  production: true,

  configurationMessage: 'The configuration is: production',
  currentBuildVersion: import.meta.env['NG_APP_PRD_VERSION'],

  firebaseConfig: {
    apiKey: import.meta.env['NG_APP_PRD_FIREBASE_API_KEY'],
    authDomain: import.meta.env['NG_APP_PRD_FIREBASE_AUTH_DOMAIN'],
    databaseURL: import.meta.env['NG_APP_PRD_FIREBASE_DATABASE_URL'],
    projectId: import.meta.env['NG_APP_PRD_FIREBASE_PROJECT_ID'],
    storageBucket: import.meta.env['NG_APP_PRD_FIREBASE_STORAGE_BUCKET'],
    messagingSenderId: import.meta.env[
      'NG_APP_PRD_FIREBASE_MESSAGING_SENDER_ID'
    ],
    appId: import.meta.env['NG_APP_PRD_FIREBASE_APP_ID'],
  },
};
