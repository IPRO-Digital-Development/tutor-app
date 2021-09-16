# Tutor App

## Structure

```
tutorapp
├── app/                Express Application.
├── docs/               Documentation and Documents for the project.
├── .env                (Not committed) Specifies secret variables to use during development.
├── .gitignore          Tells git what files and folders not to commit.
└──	README.md           (This file!) Helps explain the project.
```



## View the App

- **Development:** [localhost:3000](http://localhost:3000)

## Getting Started 

### Setup

Project is currently an Express application.

Most of the setup requires terminal access.

If you are on Linux/Unix/GNU + Linux/Mac, you are ready to setup the app :thumbsup:

If you are on Windows, install [Cygwin](https://www.cygwin.com) and add it to your PATH in your system environment variables. This will allow you to run some terminal commands that are normally not available on Windows.

If you have not used git before, configure your name and email.

```
git config --global user.name "Your Name"
git config --global user.email "Your Email"
```

Clone the repository and use `cd` to enter the folder. 

```
git clone git@github.com:IPRO-Digital-Development/tutor-app.git
cd tutor-app
```

Next, we want to install dependencies.

```
cd app
npm install
```

Final step to run application

```
npm run start
```

