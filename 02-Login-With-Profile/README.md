
# Using Passage for Login and Profile Pages

In addition to login and regsitration functionality, Passage also provides a pre-built profile page that enables users to view and edit their public account data. This repo is an example of how to build a login and profile expereince using Passage in a Node.js web application built with Express.

## Setup

The [Passage Node.js SDK](https://www.npmjs.com/package/@passageidentity/passage-node) requires a configuration object. For this example app, we'll need to provide our application with a Passage App ID and API Key, which can be set in the `.env` file. Your App ID and API Key can be found in the [Passage Console](https://console.passage.id) in your App Settings. A sample `.env` file is shown here:

```
PASSAGE_APP_ID=
PASSAGE_API_KEY=
PORT=
```

## Run With Node

To run this example app, make sure you have [node.js installed on your computer](https://nodejs.org/en/download/).

To install the dependencies:

```bash
    npm i
```

To run the application in development mode:

```bash
    npm run dev
```

## Run With Docker

Make sure you have [docker installed on your computer](https://docs.docker.com/get-docker/).

Create your docker image:

```bash
$ docker build -t example-node .
```

Run your docker container using the example-node image, changing the port numbers as necessary:

```bash
$ docker run -p 5000:5000 example-node
```

You can now visit http://localhost:5000 in your browser to see Passage in action.

## Adding Authentication to the Frontend

The easiest way to add authentication to a web frontend is with a Passage Element. The HTML below will automatically embed a complete UI/UX for user sign-in and sign-up. In this example application, we automatically use the PASSAGE_APP_ID environment variable in the `app-id` attribute.

```html
<!-- Passage will populate this div with a complete authentication UI/UX. -->
<passage-auth app-id="<Passage App ID>"></passage-auth>

<!-- Include the passage-web JavaScript from the Passage CDN. -->
<script src="https://cdn.passage.id/passage-web.js"></script>
```

## Adding a Profile Page

The profile page is created using the Passage Profile Element that can be imported from the the `@passageidentity/passage-elements` pacakge. In this example application, we automatically use the PASSAGE_APP_ID environment variable in the `app-id` attribute.

```html
<!-- Passage will populate this div with a complete authentication UI/UX. -->
<passage-profile app-id="<Passage App ID>"></passage-profile>

<!-- Include the passage-web JavaScript from the Passage CDN. -->
<script src="https://cdn.passage.id/passage-web.js"></script>
```


## Authenticating an HTTP Request

A Node.js Express server can easily authenticate an HTTP request using the Passage SDK, as shown below. Note that authenticating requests does not require an API key.

```javascript
import Passage from "@passageidentity/passage-node";
import express from "express";

const app = express();
const PORT = 5000;

let passageConfig = {
  appID: "YOUR_APP_ID",
};

// example of middleware using Passage
let passage = new Passage(passageConfig);
let passageAuthMiddleware = (() => {
  return async (req: any, res: any, next: NextFunction) => {
    try {
      let userID = await passage.authenticateRequest(req);
      if (userID) {
        // successfully authenticated. save user ID and continue
        res.userID = userID;
        next();
      }
    } catch (e) {
      // failed authentication
      console.log(e);
      res.status(401).send("Could not authenticate user!");
    }
  };
})();

// example usage of passage middleware
app.get(
  "/authenticatedRoute",
  passageAuthMiddleware,
  async (req: Request, res: any) => {
    let userID = res.userID;
    // do authenticated things...
  }
);

app.listen(PORT, () => {
  console.log(`Example app running`);
});
```

## User Management

The example application also demonstrates some user management functionality, such as getting a user's information. These operations are sensitive and require an API Key to retrieve information from Passage. This can be generated in the [Passage Console](https://console.passage.id).

```javascript
// updated passage config
let passageConfig = {
  appID: "YOUR_APP_ID",
  apiKey: "YOUR_API_KEY",
};

// get user info after authenticating a route
app.get(
  "/authenticatedRoute",
  passageAuthMiddleware,
  async (req: Request, res: any) => {
    let userID = res.userID;
    let user = passage.user.get(userID);
    console.log(user.email);
  }
);
```

