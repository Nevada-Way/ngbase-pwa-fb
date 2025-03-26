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

### ===============================================================

### INSTRUCTION ON CREATING A NEW REPO FROM ANY ONE OF THE BRANCHES

### ===============================================================

To make a copy of a branch in a new repository, you'll need to follow these steps:

===================================

1. CREATE A NEW EMPTY REPO

Cloud:
On a Remote Platform (GitHub, GitLab, etc.):
Log in to your account on the platform.
Create a new, empty repository.

Locally:
Create a new, init empty repo.

- - Create a new directory for your repository : mkdir new-repo
- - Navigate into the directory : cd new-repo
- - Initialize a new Git repository : git init
- - Rename the default branch 'master' to 'main' : git branch -m master main

===================================

2. CONNECT THE NEW REPO WITH THE SOURCE REPO

In the terminal in the dir of your new repo :
Add the Original Source Repository (the source ) as a Remote:
We will name the remote as 'my-source'

git remote add my-source ../<name_of_the_folder_of_the_source_repo_to_fetch_from>

- Assuming the source repo is under the same parent as your new repo then use '../<name>'
  otherwise give the relative path accordingly.

Make sure that the command was sucess using:

git remote -v
git remote show my-source // Displays all branches in your source remote

===================================

3. COPY THE FILES FROM THE SOURCE REPO BRANCH INTO THE NEW REPO BRANCH

Fetch the specific branch you want from the original source repository:

git fetch my-source <original_branch_name (name of the branch you want to fetch)>

The result of this command will not add any files into your new repo folder,
fetch does write files. It only updates the local git database.

======================

Create a new branch in the new repository based on the fetched branch:
Only by creating a new branch will the files be physicaly copied into the new repo folder.

git checkout -b main my-source/<original_branch_name>

The use of "-b" creates the new branch then checkouts into it.
We use the branch name 'main' because the current main branch is empty
and we want to have the files from our source populate it.

If we use any name other then 'main' then the branch 'main' not be accessable
(we wont be able to do "git switch main")
and to have a 'main' branch we would rename our new-branch to the name 'main'.

===================================

4. REMOVE THE HELPER SOURCE REMOTE

Remove the source remote, you dont need it from now on
It was only needed once to fetch the branch:

git remote remove my-source

# ===================================

5. CREATE INITIAL COMMIT

Edit the README.md or any other file just to get the commit ability.
git add .
git status
git commit "Initial commit setting up repo"

FYI: Your commits will be added on top of previous commits from the source repo

Do git log to see your last commit (from the new repo) and old commits from source repo

git log

Type 'q' to quit the log list

# ===================================

6. CONNECT AND PUSH TO REMOTE CLOUD REPO

git remote add origin <url_from_the_new_cloud_repo>

git push --set-upstream origin main

You may get an error: remote: Permission to ... denied ...
In that case approve invite the current (denied) git account as contributer
into the account where you set up you new cloud repo.

# ===================================

7. INSTALL DEPENDENCIES

Once the new branch has the code from the original branch
and is pushed to the cloud, now its time to run and see that it works.

The dependencies need to be installed so :
npm install

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
- It curently has these methods :

  - createEntry()
  - updateEntry()
  - completeOverwriteEntry()
  - appendFbUnixTimestampToObject()

- ✔ I created a specific feature service (user-db.service) to interact with the rtdb service.
- It curently has a createNewUser() method with two feature options:

  - An option to insert a timestamp property to the data object (in unix format )
  - An option to have the db root-name of the object to be a firebase sequential key code
    otherwise the root-name will be the last part of the path argument.

- ✔ To verify that the services work I created a testRealTimeDbService() function in
  the app.component and invoke it from ngOnInit(). Its only action is to create a new user object.

- BACKLOG
- ❌ Add the read capability
- ❌ Add the delete capability
- ❌ In the user-db.service add an updateUser() function
- ❌ Add function that fetches a list (like list of all the users)
