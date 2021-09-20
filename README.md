# Using Passage with Node.js & Express

Passage provides a Node.js package to easily authenticate HTTP requests. This repo is an example of how to use Passage in a Node.js web application built with Express.

## Setup

The [Passage Node.js SDK](https://www.npmjs.com/package/@passageidentity/passage-node) requires a configuration object. For this example app, we'll need to provide our application
with a Passage appID and apiKey. Navigate to .env and assign PASSAGE_APP_ID equal to your Passage app ID, and PASSAGE_API_KEY to your Passage API key.

To run this example app, make sure you have [node.js installed on your computer](https://nodejs.org/en/download/).

To install the dependencies for this example app, run the following command:

```bash
    npm i
```

Then run `npm run dev` to start the example application in development mode.

## Authenticating an HTTP Request with Passage's Express middleware

A Node.js Express server can easily authenticate an HTTP request using the Passage SDK, as shown below. If you would like to use management functionality like getting user information, you must also provide an API key, which can be generated in the Passage console (your api key is required for this example app). Note that authenticating requests do not require an API key, we're just requiring it for this example app to show you the basics of how to retrieve user data.

```javascript
import Passage from "@passageidentity/passage-node";
import hbs from "hbs";
import dotenv from "dotenv";
dotenv.config();

import express from "express";
let app = express();
app.use(express.static("views"));
app.set("view engine", "hbs");
app.set("view engine", "html");
app.engine("html", hbs.__express);

const passageConfig = {
  appID: process.env.PASSAGE_APP_ID,
  apiKey: process.env.PASSAGE_API_KEY,
};

app.get("/", (req, res) => {
  res.render("index.hbs");
});

// Authentication using the built-in Passage middleware for Express
let passage = new Passage(passageConfig);
app.get("/dashboard", passage.express, async (req, res) => {
  try {
    if (res.passage) {
      // The user has been authenticated!
      let userID = res.passage.user.id;
      let user = await res.passage.user.get(userID);
      res.render("dashboard.hbs", { userEmail: user.email });
    } else {
      res.status(401).render("");
    }
  } catch (e) {
    console.log(e);
    res.status(401).render("");
  }
});

app.listen(5000, () => {
  console.log(`Example app listening on port 5000`);
});
```

## HTTP authentication using the Passage class

If you'd prefer to not use the Passage middleware, you can use a Passage class instance:

```javascript
// Authentication using passage class instance
let passage = new Passage(passageConfig);
app.get("/dashboard", async (req, res) => {
  try {
    let userID = await passage.authenticateRequest(req, res);
    if (userID) {
      // user is authenticated
      let userData = await passage.user.get(userID);
      console.log(userData);
      res.render("dashboard.hbs", { userEmail: userData.email });
    }
  } catch (e) {
    // authentication failed
    console.log(e);
    res.send("Authentication failed!");
  }
});
```

Want to make your own Express middlewear? With the Passage class instance, you can verify successful and unsuccessful user authentication in a way that best suits your app:

```javascript
// Making your own Express middleware
let passage = new Passage(passageConfig);
let myCustomMiddlewear = (req, res, next) => {
  try {
    let userID = await passage.authenticateRequest(req, res);
    if (userID) {
      // user is authenticated
      res.passage.user.id = userID;
    }
  } catch (e) {
    // authentication failed
  }
};
```

## Adding Authentication to the Frontend

The easiest way to add authentication to a web frontend is with a Passage Element. The HTML below will automatically embed a complete UI/UX for user sign-in and sign-up. In this example application, we automatically use the PASSAGE_APP_ID environment variable in the `data-app` attribute.

```html
<!-- Passage will populate this div with a complete authentication UI/UX. -->
<div id="passage-auth" data-app="<Passage App ID>"></div>

<!-- Include the passage-web JavaScript from the Passage CDN. -->
<script src="https://cdn.passage.id/passage-web.js"></script>
```
