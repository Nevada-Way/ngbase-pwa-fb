# Project : NgbasePwaFb

This is a starter app for PWA apps and Firebase

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 19.1.3.

## Logs

### Feb 24 2025

Successful test result for today's commit (94e4f30eb71145aec9703d22dae3d73774ec95e1) with netlify and mobile device.

## Chapters

Each chapter focuses on a basic tool-feature

### =========================================================================================

### main

This branch has all the features merged from all the chapters.

### =========================================================================================

### chp-01-pwa

This chapter focuses on PWA (Progressive Web Application)
Implemented PWA features that exist / planned are :

- ✔ Install, enables app to be installed as a PWA , includes apps own logo an favicon
- ✔ Offline with cached index.html and styles, app still works even when offline.
- ❌Offline with cached API fetched data, app displays values fetched from server (like FB).
- ✔ Auto update , app will "know" a new version exists & will download+install it automatically.
- ❌Notifications, the pwa app supports Firebase Messaging

### =========================================================================================

### chp-02-environment

This chapter focuses on implementing environment managment
This includes :

- ✔ Editing angular.json to support 3 environments dev, test and production.
- ✔ Making the default environment.ts file support production values.
- ✔ Setting values for fileReplacements for each different build target.

### =========================================================================================

### chp-03-ngxbuild-secret

This chapter focuses on managing secret values using @ngx-env/build.
It's job is to inject, during the build process, environment variables from
the .env files into your Angular application .

The added value of using it is that we can exclude the secret values from the
git repo. they are only on the local machine in .env file and ngx-env/builder will
inject them during the build on our local machine.

The @ngx-env/builder is a tool for building only, it is not part of the
final result dist folder, it is not active during the execution of the app.

It is a dependency in devDependencies, so when hosting on host service (like netlify)
the service installs the @ngx-env/builder but oinly to support the creation of the dist folder contents.
After the build is done nothing from ngx-env/builder will exist in the dist folder.

This chapter includes :

- ✔ Installing @ngx-env/build.
- ✔ We implement the use of .env to set values in the environment files.
  using import.meta.env to refrencew the values in .env
- ✔ We updated the angular.json to use @ngx-env as builder, it substitutes the default
  angular cli builder named : '@angular-devkit/build-angular'
- ✔ Tested & passed on local machine with http-server, ran all 3 environments.
- ✔ Tested & passed deploy on netlify. Worked well using netlify's own environment variables
  used as substitute for the .env which is excluded from the git repo.

### =========================================================================================

### chp-04-angular-fire

This chapter focuses on Firebase Firestore

- ✔ I created a FB project in the FB console.
- ✔ Installed @angular/fire
- ✔ In .env file I set the real values for the firebase & Firestore API
  I also did this in the netlify environment values UI.
- ✔ Added firebase as provider in app.config.ts
- ✔ I created a firestore service in the services folder, this
  holds the generic CRUD functions for firestore, any service/component
  in the app can use these because they are generic.
- ✔ I also created another service for CRUD operations, this is a specific
  service for the app's log-entries.
  The concept is seperation of concerns, each service is focused on its
  specific task, so we dont want all of them interacting with
  the fb api, so one shared service focuses on the interface with fb-api while
  all the rest are focused on their tasks and interface with the shared service.

- ✔ I implemented the CRUD functionality of the log-entries to be triggered
  automaticaly every time the app.component constructor is activated (page refreshes)

- BACKLOG
- ❌ Need to name the doc id with a timestamp so that they are listed in FB console
  chronologicaly.

- ❌ Need to implement a UI to play around with the db
  Add a button that when clicked creates a new log entry.

- ❌ A input field to input id of item exiting db doc and radio buttons as follows :
  (1) Radio button to Read message of doc
  (2) Radio button to Update the doc (a hard-coded text is concatenated to start of message)
  (3) Radio button to Delete the doc

FYI : This code is not intended for UI interaction , just the programmer
can set values in the code or comment out in order to control the app.
This chp-04 is meant as base to develop your own interactions with FB.

### =========================================================================================

### chp-05-firebase-rtdb

This chapter focuses on Firebase Realtime Database

- ✔ To the existing FB project (used in chp-04) I added the Realtime DB tool
- ✔ I created a generic service (rtdb.service)to directly interact with the rtdb.
- It curently has a createEntry() method and a updateEntry() method.
- ✔ I created a specific feature service (user-db.service) to interact with the rtdb service.
- It curently has a createNewUser() method.

- ✔ To verify that the services work I created a testRealTimeDbService() function in
  the app.component and invoke it from ngOnInit(). Its only action is to create a new user object.

- BACKLOG
- ❌ Add the read capability
- ❌ Add the delete capability
- ❌ In the user-db.service add an updateUser() function
- ❌ Add function that fetches a list (like list of all the users)
