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

// Authentication using the built-in Passage middleware for Express
let passage = new Passage(passageConfig);
app.get('/dashboard', passage.express, async (req, res) => {
    try {
        if (res.passage) {
            let userID = res.passage.user.id;
            let user = await res.passage.user.get(userID)
            res.render('dashboard.hbs', {userEmail: user.email});
        } else {
            res.send("User could not be authenticated!");
        }
    } catch(e) {
        console.log(e);
        res.send("User could not be authenticated!");
    }
});

// Authentication using passage class instance
// let passage = new Passage(passageConfig);
// let myCustomMiddleware = async (req, res, next) => {
//     try {
//         let userID = await passage.authenticateRequest(req, res);
//         if (userID) {
//             // user is authenticated
//             res.passage.user.id = userID;
//             next();
//         }
//     } catch(e) {
//         // authentication failed
//         console.log(e);
//         res.status(401).send('');
//     }
// }

// app.get('/dashboard', myCustomMiddleware, async (req, res) => {
//     let userID = res.passage.user.id;
//     let user = await res.passage.user.get(userID)
//     res.render('dashboard.hbs', {userEmail: user.email});
// });

app.listen(5000, () => {
    console.log(`Example app listening on port 5000`);
});



app.get('/dashbo')