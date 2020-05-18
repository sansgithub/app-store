var mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const InitiateMongoServer = async()=>{
mongoose.connect(process.env.MONGO_URI,
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
}

module.exports = InitiateMongoServer;