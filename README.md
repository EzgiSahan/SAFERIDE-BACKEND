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

# Creating the Database
Before you start using the project, you need to create the database that you are trying to connect to. Follow these steps:

1. Make sure you have PostgreSQL installed and running on your machine or server.

2. Connect to PostgreSQL using a tool like `psql` or any graphical tool you prefer.

3. Create the database using the command:
   CREATE DATABASE safeRide;

4. Grant necessary privileges to the user specified in the `DB_USER` environment variable:
   GRANT ALL PRIVILEGES ON DATABASE safeRide TO <DB_USER>;

# Libraries
### Sequelize
We use Sequelize as an ORM to interact with the database. The models defined in the `models` folder correspond to the database tables. Update these models to match your application's data structure.

### Next.js
If you're looking for a frontend framework, consider using Next.js. It provides server-side rendering and routing capabilities, enhancing the user experience. Check out the Next.js documentation for more details.

### Node.js
This project is built using Node.js, a runtime environment for executing JavaScript code server-side. Make sure you have Node.js version 8.0.0 or later installed.

For further information on using these libraries, refer to their respective documentation.

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
