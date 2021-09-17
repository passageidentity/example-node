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
    res.render('index.hbs');
});

// Authentication using the built-in Passage middleware for Express
// let passage = new Passage(passageConfig);
// app.get('/dashboard', passage.express, async (req, res) => {
//     // The user has been authenticated!
//     let userID = res.passage.user.id;
//     let user = await res.passage.user.get(userID)
//     res.render('dashboard.hbs', {userEmail: user.email});
// });

// Authentication using passage class instance
let passage = new Passage(passageConfig);
app.get('/dashboard', async (req, res) => {
    try {
        let userID = await passage.authenticateRequest(req, res);
        if (userID) {
            // user is authenticated
            let userData = await passage.user.get(userID);
            console.log(userData);
            res.render('dashboard.hbs', {userEmail: userData.email});
        }
    } catch(e) {
        // authentication failed
        console.log(e);
        res.send('Authentication failed!');
    }
});

app.listen(5000, () => {
    console.log(`Example app listening on port 5000`);
});
