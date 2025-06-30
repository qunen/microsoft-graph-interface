# microsoft-graph-interface
This is a repository that is able to authenticate user to obtain an access token to call Microsoft Graph API.

## Prerequisite
```
bun.js          v1.2.10
Docker          v24.0.6
```

## Setup
### Micrsoft Entra App and Service Account
Firstly, register an app on Microsoft Entra Admin Centre with the desired supported account type. Once it is created, store the Application (Client) ID, and the Directory (Tenant) ID if the registered app only supports your organizational directory.

Then, prepare a user account that will be used to authenticate with the App to retrieve an access token to make Microsoft Graph API calls. It is recommended to create a service account for this with the level of scopes you want to access with Microsoft Graph API. Do note that this account should have `Application Administrator` role assigned.

Next, create a copy of `.env` environment file from `.env.example`. Replace the `CLIENT_ID` value with the Application ID of the previously registered app. If the registered app only supports your organizational directory, replace the `TENANT` value with the Directory ID of the regsitered app. Else, leave the value as common.

### Database
If you are using a dedicated Mongodb, replace the `MONGODB_CONNECTION_STRING` in `.env` file with the connection string to that database. You can also spin up an instance of Mongodb with Docker using the following command.
```bash
docker run -d --name mongodb-local \
-e MONGO_INITDB_ROOT_USERNAME=admin \
-e MONGO_INITDB_ROOT_PASSWORD=password \
-e MONGO_INITDB_DATABASE=database -p 2717:27017 mongo:8
```
If you choose to use a spin up Mongodb using the above command, replace the `MONGODB_CONNECTION_STRING` in `.env` with the following connetion string.
```
MONGODB_CONNECTION_STRING=mongodb://admin:password@localhost:2717/database?authSource=admin
```
Alternatively, if you are running this application with `docker compose`, keep the `MONGODB_CONNECTION_STRING` unchange.

## Running the Application
### Docker Compose
The easiest way to run this application is through `docker compose`. Run the following command the start the application.
```bash
docker compose build && docker compose up
```

### Building and Running from a Docker Image
To build a docker image, run the following command.
```bash
docker build -t ms-graph-interface:local .
```
To run the built image, run the following command.
```
docker run -d -p 8080:8080 ms-graph-interface:local
```

### Bun.js
To run this application with Bun.js, first run the following command to install dependancies.
```bash
bun install
```

Then, run the following command to run.
```bash
bun src/index.ts
```

## Using the Application
Before obtaining the data from Microsoft Graph API, we first have to authenticate the user with device code flow to obtain an access token. Initiate the device code authentication with the following API call.

```
POST /api/v1/auth/token/devicecode
```
The following is a sample response.
```
{
    "user_code": "HRPASR2HP",
    "device_code": "HAQAB...",
    "verification_uri": "https://microsoft.com/devicelogin",
    "expires_at": "2025-06-30T14:00:00.000Z"
}
```
Please navigate to the `verification_uri` and enter the `user_code` when prompted. Then, proceed to authenticate with the dedicated service account created and authorized all required permissions. 

Once authenticate, with the `device_code` in the previous request, make the following request to verify the device code. The `device_code` provided in the initial response body should by provided in the request body for this request.
```
POST /api/v1/auth/token/verify
{
    "device_code": "HAQAB..."
}
```
If successful, the access token details will be provided in the response body.
```
{
    "access_token": "Bearer eyJ0e...",
    "expires_at": "2025-06-30T15:00:00.000Z",
    "refresh_token": "1.AcYAy..."
}
```
The `access_token` will be used in the `Authorization` request header to make obtain data from Microsoft Graph API. Do note that this token is short-lived, and it will expires on the datetime in `expires_at`.

The `refresh_token` can be use to obtain a new `access_token` anytime. The following endpoint will facilitate generating a new `access_token` and `refresh_token`. Doing so will also render the old token invalid.
```
POST /api/v1/auth/token/refresh
{
    "refresh_token": "1.AcYAy..."
}
```

With the generated `access_token`, security group data that is available to the service account can be obtained from Microsoft Graph API with the following endpoint. Do include the access token in the  `Authorization` request header.
```
GET /api/v1/graph/securitygroup
```