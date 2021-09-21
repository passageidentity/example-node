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

// example of custom middleware
let passage = new Passage(passageConfig);
let passageAuthMiddleware = (() => {
   return async (req, res, next) => {
     try {
       let userID = await passage.authenticateRequest(req);
       if (userID) {
           // user is authenticated
           res.userID = userID;
            next();
       }
     } catch (e) {
       console.log(e);
       res.render("unauthorized.hbs")
     }
   };
 })();

// authenticated route that uses middleware
app.get("/dashboard", passageAuthMiddleware, async (req, res) => {
    let userID = res.userID
    let user = await passage.user.get(userID)
    res.render('dashboard.hbs', {userEmail: user.email});
});


app.listen(5000, () => {
    console.log(`Example app listening on port 5000`);
});



app.get('/dashbo')