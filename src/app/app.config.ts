import { environment } from '../environments/environment';

import {
  ApplicationConfig,
  provideZoneChangeDetection,
  isDevMode,
} from '@angular/core';

// For router support
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';

// For PWA support
import { provideServiceWorker } from '@angular/service-worker';

// For Firebase support
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

// Setting appConfig object
export const appConfig: ApplicationConfig = {
  // Setting the providers for the application configuration
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),

    // Provider for PWA support
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000',
    }),

    // Providers for firebase
    provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
    provideFirestore(() => getFirestore()),
  ],
};
