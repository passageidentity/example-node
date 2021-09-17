import Passage from "@passageidentity/passage-node";
import app from './setup.js';
import dotenv from "dotenv";
dotenv.config();

const passageConfig = {
    appID: process.env.APP_ID,
    apiKey: process.env.API_KEY,
};

app.get('/', (req, res) => {
    res.render('index.hbs');
});

// Authentication using passage as an Express middleware
let passage = new Passage(passageConfig);
app.get('/dashboard', passage.express, async (req, res) => {
    // The user has been authenticated!
    let userData = res.passage.user.data;
    console.log(userData);
    res.render('dashboard.hbs', {userEmail: userData.email});
});

// Authentication using passage class instance
// let passage = new Passage(passageConfig);
// app.get('/dashboard', async (req, res) => {
//     try {
//         let user = await passage.authenticateRequest(req, res);
//         if (user) {
//             // user is authenticated
//             console.log(user);
//             res.render('dashboard.hbs', {userEmail: user.data.email});
//         }
//     } catch(e) {
//         // authentication failed
//         console.log(e);
//         res.send('Authentication failed!');
//     }
// });




app.listen(5000, () => {
    console.log(`Example app listening on port 5000`);
});
