# SAFERIDE-BACKEND


# Environment vars
This project uses the following environment variables, Please create a .env file in the root of the project with the following attributes mentioned:

| Name                          | Description                         | Default Value                                  |
| ----------------------------- | ------------------------------------| -----------------------------------------------|
|URL                           | Cors accepted values                | "*"                                            |
|ACCESS_TOKEN_SECRET                           | Generate your Access token secret for your JWT Tokens               | "-"                                            |
|REFRESH_TOKEN_SECRET                             | Generate your Refresh token secret for your JWT Tokens               | "-"                                            |
|DB_USER                           | Database postgres username               | "postgres"                                            |
|DB_USER_PASSWORD                           | Database postgres username                | "postgres"                                            |
|DB_NAME                           | Name of your database               | "safeRide"                                            |


# Pre-requisites
- Install [Node.js](https://nodejs.org/en/) version 8.0.0


# Getting started
- Clone the repository
```
git clone  <git lab template url> <project_name>
```
- Install dependencies
```
cd <project_name>
npm install
```
- Build and run the project
```
npm start
```
  Navigate to `http://localhost:8000`

## Project Structure
The folder structure of this app is explained below:

| Name | Description |
| ------------------------ | --------------------------------------------------------------------------------------------- |
| **node_modules**         | Contains all  npm dependencies                                                            |
| **configuration**        | Application configuration including environment-specific configs 
| **controllers**          | Controllers define functions to serve various express routes. 
| **middlewares**          | Express middlewares which process the incoming requests before handling them down to the routes
| **routes**               | Contain all express routes, separated by module/area of application                       
| **models**               | Models define schemas that will be used in storing and retrieving data from Application database  |
| **index.js**               | Entry point to express app                                                               |
| package.json             | Contains npm dependencies as well as [build scripts](#what-if-a-library-isnt-on-definitelytyped)   | 
