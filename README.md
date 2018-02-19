# NodeJS based Express Server for Geospatial Data Processing

## Setup
1. install dependencies ```npm install```
2. Install PostgreSQL DB Server and make sure psql command is available
3. Import DB Data from [geoapi.sql](geoapi.sql) file: ```psql -U <user_name> -d <database_name> -f geoapi.sql -h <host_name>```
4. start development server:
    - create and configure .env file (see [.env.example](.env.example))
    - start the server: ```npm run dev```
5. start production server: ```npm run start```

## Usage
1. **Create new user**: make a post request to [/signup](http://localhost:3000/signup) with a json body like ```{ "username":"abc", "password": "def"}```
2. **Sign in**: make a post request to [/signin](http://localhost:3000/signin) with a json body like ```{ "username":"abc", "password": "def"}```.
   - If the credential are valid the server responds a json with a api token: 
    ```
    {
      "success": true,
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InRlc3QiLCJwbGFuIjoiZnJlZSIsImlzcyI6ImxvY2FsaG9zdDozMDAwIiwiaWF0IjoxNTE4OTgxMTk5LCJleHAiOjE1MTg5ODQ3OTl9.882VgD1UdebAQONZZbouYUqHLl_mWE4v3ABlyWZrRro"
    }
    ```
    - Use this token in the Header of all API requests: Authorization: Bearer <your_token>
3. Access API Endpoint of your choice ✌