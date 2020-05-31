let mongoose = require('mongoose');
let Schema = mongoose.Schema;

const userSchema = new Schema({
    name:{
        type: String,
        required: true
    },
    email:{
        type: String,
        unique: true,
        required: true
    },
    password:{
        type: String,
        required: true
    },    
    isVerified : {
        type: Boolean,
        default: false
    },
    createdAt:{
        type: Date,
        default: Date.now()
    },
    role: {
        type: String,
        default: 'basic',
        enum : ["basic", "admin"]
    }
});

module.exports = mongoose.model('UserModel', userSchema);