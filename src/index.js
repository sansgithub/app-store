let express = require('express');
var dotenv = require('dotenv');
const bodyParser = require('body-parser');
let app = express();
var mongoose = require('mongoose');

mongoose.connect("mongodb+srv://numetal37:4y1SAVpxqGkTQjvv@cluster0-tx4nb.mongodb.net/test?retryWrites=true&w=majority",
{ 
    useNewUrlParser: true,
    useCreateIndex: true,
     useUnifiedTopology: true 
  }).then(() => {
    console.log("Successfully connected to the database");    
}).catch(err => {
    console.log('Could not connect to the database. Exiting now...', err);
    process.exit();
});

dotenv.config();

const PORT = process.env.PORT;
let indexRouter = require('./routes/index');
let createRouter = require('./routes/createRoute');

app.use(bodyParser.json());
app.use(indexRouter);
app.use(createRouter);

app.listen(PORT, ()=>{
    console.log(`Server has started at ${PORT}`);
})