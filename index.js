import passage from "@passageidentity/passage-node";
import app from './setup.js';
import dotenv from "dotenv";
dotenv.config();

const passageConfig = {
    appID: process.env.APP_ID,
    apiKey: process.env.API_KEY,
    failureRedirect: '/unauthorized.hbs'
};

app.get('/', (req, res) => {
    res.render('index.hbs');
});

app.get('/dashboard', passage(passageConfig), async (req, res) => {
    // The user has been authenticated!
    let userData = res.passage.user.data;
    console.log(userData);
    res.render('dashboard.hbs', {userEmail: userData.email});
});

app.listen(5000, () => {
    console.log(`Example app listening on port 5000`);
});
