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