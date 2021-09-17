import hbs from "hbs";
import express from "express";
let app = express();

app.use(express.static('views'));
app.set('view engine', 'hbs');
app.set('view engine', 'html');
app.engine('html', hbs.__express);

export default app;