const express = require('express');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const appRouter = require('./routes/app');
const userRouter = require('./routes/user');
const app = express();
const InitiateMongoServer = require('./config/db.config');
const PORT = process.env.PORT;

InitiateMongoServer();
dotenv.config();

app.use(bodyParser.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: true}));
app.use(appRouter);
app.use(userRouter);


app.listen(PORT, ()=>{
    console.log(`Server has started at ${PORT}`);
})