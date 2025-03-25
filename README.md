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

REMOVE THE HELPER SOURCE REMOTE

Remove the source remote, you dont need it from now on
It was only needed once to fetch the branch:

git remote remove my-source

# ===================================

CREATE INITIAL COMMIT

Edit the README.md or any other file just to get the commit ability.
git add .
git status
git commit "Initial commit setting up repo"

FYI: Your commits will be added on top of previous commits from the source repo

Do git log to see your last commit (from the new repo) and old commits from source repo

git log

Type 'q' to quit the log list

# ===================================

CONNECT AND PUSH TO REMOTE CLOUD REPO

git remote add origin <url_from_the_new_cloud_repo>

git push --set-upstream origin main

You may get an error: remote: Permission to ... denied ...
In that case approve invite the current (denied) git account as contributer
into the account where you set up you new cloud repo.
