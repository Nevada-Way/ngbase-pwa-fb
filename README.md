# Project : NgbasePwaFb

This is a starter app for PWA apps and Firebase

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 19.1.3.

## Logs

### Feb 24 2025

Successful test result for today's commit (94e4f30eb71145aec9703d22dae3d73774ec95e1) with netlify and mobile device.

## Chapters

Each chapter focuses on a basic tool-feature

### main

This branch has all the features merged from all the chapters.

### chp-01-pwa

This chapter focuses on PWA (Progressive Web Application)
Implemented PWA features that exist / planned are :

- ✔ Install, enables app to be installed as a PWA , includes apps own logo an favicon
- ✔ Offline with cached index.html and styles, app still works even when offline.
- ❌Offline with cached API fetched data, app displays values fetched from server (like FB).
- ✔ Auto update , app will "know" a new version exists & will download+install it automatically.
- ❌Notifications, the pwa app supports Firebase Messaging

### chp-02-environment

This chapter focuses on implementing environment managment
This includes :

- ✔ Editing angular.json to support 3 environments dev, test and production.
- ✔ Making the default environment.ts file support production values.
- ✔ Setting values for fileReplacements for each different build target.

### chp-03-ngxbuild-secret

This chapter focuses on managing secret values using ngx-build
This includes :

- ✔ Installing @ngx-build.
- ✔ In app component used the environment variable to display configuration build target.
  Also updated the angular.json to use @ngx-env as builder.
