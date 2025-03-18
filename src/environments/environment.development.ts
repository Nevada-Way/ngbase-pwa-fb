export const environment = {
  production: false,
  configurationMessage: 'Running in development configuration',
  currentBuildVersion: import.meta.env['NG_APP_DEV_VERSION'],

  firebaseConfig: {
    apiKey: import.meta.env['NG_APP_DEV_FIREBASE_API_KEY'],
    authDomain: import.meta.env['NG_APP_DEV_FIREBASE_AUTH_DOMAIN'],
    databaseURL: import.meta.env['NG_APP_DEV_FIREBASE_DATABASE_URL'],
    projectId: import.meta.env['NG_APP_DEV_FIREBASE_PROJECT_ID'],
    storageBucket: import.meta.env['NG_APP_DEV_FIREBASE_STORAGE_BUCKET'],
    messagingSenderId: import.meta.env[
      'NG_APP_DEV_FIREBASE_MESSAGING_SENDER_ID'
    ],
    appId: import.meta.env['NG_APP_DEV_FIREBASE_APP_ID'],
  },
};
