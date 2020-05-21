const { validationResult} = require('express-validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

exports.signup =  async (req, res) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array()
            });
        }
        
        const email = req.body.email;
        const password = req.body.password;

        try{
            let user = await User.findOne({
                email
            });
            if(user){
                return res.status(400).json({
                    message: "User already exists"
                });
            }

            user = new User({
                name: req.body.name,
                email: req.body.email,
                password: req.body.password
            });

            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);

            await user.save();
            res.send("User Created");
        } catch (err) {
            console.log(err.message);
            res.status(500).send("Error in Saving");
        }
    
};

exports.login = async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        });
    }
    let user = await User.findOne({email});
    if (!user) {
        return res.status(400).send('Incorrect email or password.');
    }
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
        return res.status(400).send('Incorrect email or password.');
    }
 
    const payload = {
        id: user.id,
        email: user.email
    };

    jwt.sign(
        payload,
        process.env.JWT_SECRET, {
            expiresIn: 10000
        },
        (err, token) => {
            if (err) throw err;
            res.status(200).json({
                token
            });
        }
    );
}

exports.searchUser = (req, res) => {
    User.find({name:{ $regex: req.params.user_name, $options: 'i' }}, function(err, result){
        if (err) {
            res.send(err);
          } else {
            res.send(result);
          }
    });
}
