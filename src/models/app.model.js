let mongoose = require('mongoose');
let Schema = mongoose.Schema;

const appSchema = new Schema({
    name:{
        type: String,
        required: true
    },
    developer:{
        type: String,
        required: true
    },
    email:{
        type: String
    },
    status:{
        type:Boolean,
        default: false
    },
    createdBy:{
        type: String,
        default: null
    },
    icon:{
        type: String,
        required: true
    },
    screenshots:[{
        type: String
    }]
});

module.exports = mongoose.model('AppModel', appSchema);