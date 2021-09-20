import Passage from "@passageidentity/passage-node";
import hbs from "hbs";
import dotenv from "dotenv";
dotenv.config();

import express from "express";
let app = express();
app.use(express.static('views'));
app.set('view engine', 'hbs');
app.set('view engine', 'html');
app.engine('html', hbs.__express);

const passageConfig = {
    appID: process.env.PASSAGE_APP_ID,
    apiKey: process.env.PASSAGE_API_KEY,
};


app.get('/', (req, res) => {
    res.render('index.hbs', { appID: process.env.PASSAGE_APP_ID });
});

// Authentication using passage class instance
let passage = new Passage(passageConfig);
app.get("/authenticatedRoute", async (req, res) => {
  try {
    let userID = await passage.authenticateRequest(req);
    if (userID) {
      // user is authenticated
      let { email } = passage.user.get(userID);
      res.render("You're authenticated with Passage!");
    }
  } catch (e) {
    // authentication failed
    console.log(e);
    res.send("Authentication failed!");
  }
});

// example of custom middleware
// let passage = new psg(passageConfig);
// let customMiddleware = (() => {
//   return async (req, res, next) => {
//     try {
//       let userID = await passage.authenticateRequest(req);
//       if (userID) res.userID = userID;
//       else res.userID = false;
//       next();
//     } catch (e) {
//       console.log(e);
//       res.status(401).send("Could not authenticate user!");
//     }
//   };
// })();

// example implementation of custom middleware
// app.get("/", customMiddleware, async (req, res) => {
//   let userID = res.userID;
//   if (userID) {
//     res.send(userID);
//   } else {
//     res.send("Failed to get user");
//   }
// });


app.listen(5000, () => {
    console.log(`Example app listening on port 5000`);
});



app.get('/dashbo')