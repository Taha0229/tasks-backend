# Production grade backend for tasks management

⚡ Best practices to productionize your API with Express.Js and MongoDB 💪

## Project Overview

This project mainly focuses on production grade practices namely best coding practices, project structure, utils, naming conventions, and more. The API is a simple implementation of task management system.

**Access the deployed API from [here](https://tasks-backend-g3rjxrwug-tahas-projects-7dcb9fb9.vercel.app/)**
**Access the Postman collection from [here](https://documenter.getpostman.com/view/23795224/2sAYQamrb9)** 

## Tech-stack

| Technology |
| ---------- |
| Node.js    |
| Express.js |
| MongoDB    |
| Mongoose   |

| Additional Packages |
| ------------------- |
| bcrypt              |
| cookie-parser       |
| cors                |
| dotenv              |
| jsonwebtoken        |
| nodemon (dev)       |
| prettier (dev)      |

## Objectives

1. Authentication (JWT-based):
   1. Implement a simple user registration and login API.
   2. Use JWT for securing endpoints.
   3. Protect all task-related endpoints so only authenticated users can access them.
2. Task Management:
   1. Create CRUD (Create, Read, Update, Delete) operations for tasks.
   2. Each task should have the following fields:
      1. id: Unique identifier for the task.
      2. title: A short title for the task.
      3. description: A detailed description of the task (optional).
      4. status: One of pending, in-progress, completed.
   3. Endpoints:
      1. Create a new task.
      2. Retrieve all tasks for the logged-in user.
      3. Retrieve one task based on id for the logged-in user.
      4. Update a task’s title, description, or status.
      5. Delete a task.

## Routes

The API mainly has a root route and two groups of routes i.e. `user` routes and `tasks` routes with `base` **`http://localhost:8000/api/v1/`**

1. root route: `https://tasks-backend-g3rjxrwug-tahas-projects-7dcb9fb9.vercel.app/` (deployed) or `http://localhost:8080/` (local)
2. user routes:  
   1. **[POST]** Register a new user : `{{base}}/users/register`
   2. **[POST]** Login user: `{{base}}/users/login`
   3. **[POST]** Logout user: `{{base}}/users/logout`
   4. **[POST]** Generate a refresh token (mainly used by frontend developer): `{{base}}/users/refresh-token`
   5. **[GET]** current-user: `{{base}}/users/current-user`
   6. **[POST]** change-password: `{{base}}/users/change-password`
3. tasks routes:
   1. **[GET]** Get all tasks for the logged in user: `{{base}}/tasks`
   2. **[GET]** Get task based on `id` for the logged in user: `{{base}}/task/:taskId`
   3. **[POST]** Create a new task with the logged in user: `{{base}}/task`
   4. **[PUT]** Update all the entries in the task aka full update: `{{base}}/task/:taskId`
   5. **[PATCH]** Update one or more entries in the task aka partial update: `{{base}}/task/:taskId`
   6. **[DELETE]** Delete a task: `{{base}}/task/:taskId`

**For further information, check out the `postman` collection, [here]("https://documenter.getpostman.com/view/23795224/2sAYQamrb9)**
  
## How to run Locally?

### Step 1: Fork and clone

Fork the repo and clone it on your local machine using, so you can modify on your own code:
`git clone <url of forked repo>`

### Step 2: Install Dependencies

Install all the necessary dependencies for the project using the following command:
`npm i` or `npm install`

### Step 3: Configure your MongoDB Atlas

Signup or Login to MongoDB, and create a new MongoDB project while initializing a collection. Do not forget to add `0.0.0.0/0` in the allowed `IP addresses` to accept incoming requests from anywhere (or just add your local IP). Finally, get the connection string, which can be found by clicking on `connect` button on the overview tab followed by navigating to `compass`.

### Step 4: Configure Environment Variables

Refer `.env.sample` to setup your `.env` file. It must have the following environment variables:

1. PORT - port to listen incoming requests
2. MONGODB_URI - mongodb connection string, obtained from previous step
3. CORS_ORIGIN - set to `*` to accept requests from everywhere
4. ACCESS_TOKEN_SECRET - access token to sign the `JWT` token
5. ACCESS_TOKEN_EXPIRY - expiry duration for the access token (short lived)
6. REFRESH_TOKEN_SECRET - refresh token stored in the DB to re-validate the user when access token is expired
7. REFRESH_TOKEN_EXPIRY - expiry duration for the access token (long lived)

### Step 5: Run the App

Run using `nodemon` using `npm run dev` or with vanilla `Node.js` using `npm run start`

## Project Setup

The project follows an MVC architecture, emphasizing the S.O.L.I.D principles. The root folder is `tasks-backend` with `src` and `public` folders.

1. project configuration:
   1. `.env` and `.env.sample`: environement variables for the project - port, mongodb uri, cors, access token secret, refresh token secret and token expiry time.
   2. `.gitignore`: To ignore files and folders to be pushed into the repository.
   3. `prettierignore` and `prettierrc`: Configurations for `prettier` to have a clean and uniform format across collaborating teams and engineers.
   4. `vercel.json`: Configurations for API deployment on `Vercel`
2. `index.js` is the main file is the starting point for the API responsible for triggering `DB` connection, loading environment variables, and start listening for incoming requests.
3. `app.js`  instantiates the `express` app, configures `Cross-Origin Resource Sharing`, `Cookies`, manage `middlewares` and implements the `routers`
4. `Controllers`: The project has two controllers namely `user.controller.js` and `tasks.controller.js`. The controller consists of all the logic required for all the routes.
5. `db` is used to establish the database connection in a modular manner.
6. `Models`: The project has two models namely `user.model.js` and `task.model.js` which has `Schemas` for the database collections with useful methods.
7. `Middleware`: A custom middleware to handle JWT based authentication and authorization.
8. `Routes`: The project has two routes, `task.routes.js` and `user.routes.js`. The user router has some public endpoints along with protected endpoints. However, all the endpoints in task router are protected and need authorization to access.
9. `Utils`: Useful and reusable helper functions
    1. `ApiError.js`: implements a custom and reusable error, inheriting the `Error` class.
    2. `ApiResponse.js`: implements a custom and reusable response format with status code, data, and message.
    3. `asyncHandler`: A higher order function to handle asynchronous functions.  

## Deployment details

The API is deployed on vercel with minimal and easy configurations.

1. configure `vercel.json`
2. add a start command in `package.json`
3. push the updated code into your `github` repo
4. initialize a project on vercel and pull the project from the `github`
5. configure environment variables in the deployment
6. Vercel will create a CI/CD pipeline using Github Actions, upon making any further changes in the repo (main branch) will result in a new deployment

## GitHub commit message format

Feat– feature

Fix– bug fixes

Docs– changes to the documentation like README

Style– style or formatting change

Perf – improves code performance

Test– test a feature

Example: `git commit -m "Docs: add readme"` or `git commit -m "Feat: add chatting interface"`  