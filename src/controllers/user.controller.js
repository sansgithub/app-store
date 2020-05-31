const { validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const nodemailer = require("nodemailer");
const crypto = require('crypto');
const Token = require('../models/token.model');

exports.signup = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        });
    }

    const email = req.body.email;
    const password = req.body.password;

    try {
        let user = await User.findOne({
            email
        });
        if (user) {
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

        await user.save((err) => {
            if(err){
                return res.status(500).send(err.message);
            }
            var token = new Token({ _userId: user._id, token: crypto.randomBytes(16).toString('hex') });
            token.save(function (err) {
                if (err) { return res.status(500).send({ msg: err.message }); }
     
                // Send the email
                var transporter = nodemailer.createTransport({ host: "smtp.mailtrap.io",
                port: 2525,
                auth: {
                  user: "07cf82b324ff0c",
                  pass: "d7dda573bdd320"
                } });
                var mailOptions = { from: 'app@store.com', to: user.email, subject: 'Account Verification Token', text: 'Hello,\n\n' + 'Please verify your account by clicking the link: \nhttp:\/\/' + req.headers.host + '\/api\/confirmation\/' + token.token + '.\n' };
                transporter.sendMail(mailOptions, function (err) {
                    if (err) { return res.status(500).send({ msg: err.message }); }
                    res.status(200).send('A verification email has been sent to ' + user.email + '.');
                });
            });
        });
        res.send("User Created");
    } catch (err) {
        console.log(err.message);
        res.status(500).send("Error in Saving");
    }

};

exports.confirmEmail = async(req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        });
    }

    Token.findOne({ token : req.body.token}, (err, token) => {
        if (!token) {
            return res.status(400).send({ type: 'not-verified', msg: 'We were unable to find a valid token. Your token my have expired.' });
        }

        User.findOne({ _id: token._userId, email: req.body.email }, function (err, user) {
            if (!user) return res.status(400).send({ msg: 'We were unable to find a user for this token.' });
            if (user.isVerified) return res.status(400).send({ type: 'already-verified', msg: 'This user has already been verified.' });
 
            // Verify and save the user
            user.isVerified = true;
            user.save(function (err) {
                if (err) { return res.status(500).send({ msg: err.message }); }
                res.status(200).send("The account has been verified. Please log in.");
            });
        });
    });
}


exports.login = async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        });
    }
    let user = await User.findOne({ email });
    if (!user) {
        return res.status(400).send('Incorrect email or password.');
    }
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
        return res.status(400).send('Incorrect email or password.');
    }

    if(!user.isVerified){
        return res.status(401).send('Account not verified');
    }

    const payload = {
        id: user.id,
        email: user.email,
        role: user.role
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

exports.resendToken = async(req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        });
    }

    User.findOne({ email: req.body.email }, function (err, user) {
        if (!user) return res.status(400).send({ msg: 'We were unable to find a user with that email.' });
        if (user.isVerified) return res.status(400).send({ msg: 'This account has already been verified. Please log in.' });
 
        // Create a verification token, save it, and send email
        var token = new Token({ _userId: user._id, token: crypto.randomBytes(16).toString('hex') });
 
        // Save the token
        token.save(function (err) {
            if (err) { return res.status(500).send({ msg: err.message }); }
 
            // Send the email
            var transporter = nodemailer.createTransport({ host: "smtp.mailtrap.io",
            port: 2525,
            auth: {
              user: "07cf82b324ff0c",
              pass: "d7dda573bdd320"
            } });
            var mailOptions = { from: 'no-reply@codemoto.io', to: user.email, subject: 'Account Verification Token', 
            text: 'Hello,\n\n' + 'Please verify your account by clicking the link: \nhttp:\/\/' + req.headers.host + '\/api\/confirmation\/' + token.token + '.\n' };
            transporter.sendMail(mailOptions, function (err) {
                if (err) { return res.status(500).send({ msg: err.message }); }
                res.status(200).send('A verification email has been sent to ' + user.email + '.');
            });
        });
 
    });
}

exports.searchUser = (req, res) => {
    User.find({ name: { $regex: req.params.user_name, $options: 'i' } }, function (err, result) {
        if (err) {
            res.send(err);
        } else {
            res.send(result);
        }
    });
}

exports.deleteUser = (req, res) => {
    if(req.user.id == '5ece339ba935d9109cf9f4c8'){
        User.findByIdAndRemove(req.params.id, function (err) {
            if (err) {
                return next(err);
            }
            res.send('User deleted successfully!');
        });
    }else{
        res.send('You donot have permission');
    }
}

exports.showUsers = (req, res) => {
    User.find({}, function (err, result) {
        if (err) {
            res.send(err);
        } else {
            res.send(result);
        }
    });
}

exports.updateProfile = (req, res) => {
    res.send(req.user.id);
}
