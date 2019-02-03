# NodeJS Server for Geospatial Data Processing

[![Greenkeeper badge](https://badges.greenkeeper.io/tobi238/express-geoapi.svg)](https://greenkeeper.io/)

![Build](https://travis-ci.org/tobi238/express-geoapi.svg?branch=master)

## Setup

1. Install dependencies `npm install`
2. Setup PostgreSQL DB:

   1. Install Docker if you don't already have it.
   2. Create and start a new Docker PostgreSQL Container: `npm db:create_container`
   3. Seed the DB: `npm db:seed`

3. start development server:
   - create and configure .env file (see [.env.example](.env.example))
   - start the server: `npm run dev`
4. start production server: `npm run start`

## Usage

1. **Create new user**: make a post request to [/signup](http://localhost:3001/signup) with a json body like `{ "username":"abc", "password": "def"}`
2. **Sign in**: make a post request to [/signin](http://localhost:3001/signin) with a json body like `{ "username":"abc", "password": "def"}`.

   - If the credential are valid the server responds a json with a api token:

   ```json
   {
     "success": true,
     "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InRlc3QiLCJwbGFuIjoiZnJlZSIsImlzcyI6ImxvY2FsaG9zdDozMDAwIiwiaWF0IjoxNTE4OTgxMTk5LCJleHAiOjE1MTg5ODQ3OTl9.882VgD1UdebAQONZZbouYUqHLl_mWE4v3ABlyWZrRro"
   }
   ```

   - Use this token in the Header of all API requests: Authorization: Bearer <your_token>

3. Access API Endpoint of your choice ✌
