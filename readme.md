# Daily Diet API

## Table of Contents

- [Overview](#overview)
    - [Requirements](#requirements)
    - [Features](#features)
    - [Usage](#usage)
- [Routes](#routes)
    - [Endpoints](#endpoints)
        - [Users](#users)
        - [Meals](#meals)
- [Database](#database)
    - [Configuration](#configuration)

## Overview

This API REST uses Node.js to manage a diet and keep track of daily meals. For this, use the [TypeScript](https://www.typescriptlang.org/) and [Fastify](https://fastify.dev/) framework.  Data is stored in the **sqlite** database, and operations are performed using the [Knex](https://knexjs.org/) query builder. Cookies are used to identify the user.

### Requirements

For this project, the following (essential for execution) resources were used:
 - [Node.js](https://nodejs.org/)

### Features

- **Create a user**: A user could be created with `name` and `email`. The email field is unique; if a user with that email address exists, a new session id will be created.
- **Identify a user between requests**: User could be recognized by a session id stored in cookies.
- **Record a meal**: User can record a meal using the following fields:
    - Name
    - Description
    - In or out diet
- **Update meal**: User may update your meals.
- **Delete meal**: User may delete your meals.
- **List all meals**: User may list all of your meals.

### Usage

First, install the dependencies

```
npm install
```

Run migrations: 
```
npm run knex -- migrate:latest
```

And then run server:

```
npm run dev
```

The server will run on port `3333`.

## Routes

Routes are managed by a [Fastify](https://fastify.dev/) plugin that implements function routes.

### Endpoints

#### Users

- **POST** - `/users`: Create a new user or a new session id if email was recorded.
    - Data should be sent in the request body in JSON format.
    - Example:
        ```
        {
            "name": "John Doe",
	        "email": "johndoe@email.com"
        }
        ```

#### Meals

*Meals could only be made, visualized, changed, and deleted when the user's session id was created.*

- **POST** - `/meals`: Create a new meal.
    - Data should be sent in the request body in JSON format.
    - Example:
        ```
        {
            "name": "Dinner",
            "description": "Pizza",
            "in_diet": false
        }
        ```

- **GET** - `/meals`: List all meals from user.
    - Data is received in JSON format.
- **PUT** - `/meals/:id`: Update a meal from the user.
    - Data is received in JSON format.
- **DELETE** - `/meals/:id`: Delete a meal from the user.
    - Data is received in JSON format.


- **PUT** - `/meals/:id`: Get a specific transaction from the user.
    - Data is received in JSON format.
    - Only user transactions.
- **GET** - `/transactions/summary`: Get user balance account
    - Data is received in JSON format.
    - Example:
        ```
        {
            "summary": {
                "amount": 6836
            }
        }
        ```


## Database

The application uses the [Knex.js](https://knexjs.org/) query builder for database management. Knex allows you to choose a database that is compatible with it. 

The database utilized in this application is **sqlite**.

### Configuration

The database is configured using a virtual environment included in the `.env` file. Inside `.env.example`, you can find an example of variables. 

