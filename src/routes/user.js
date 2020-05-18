const express = require('express');
let router = express.Router();
const {check } = require('express-validator/check');
const user = require('../controllers/user.controller');

router.post('/api/signup',[
    check("name", "Please enter a valid name").not().isEmpty(),
    check("email","Please enter a valid email address").isEmail(),
    check("password").isLength({ min: 5 }).withMessage('Password must be at least 5 chars long')
    ], 
    user.signup
);

router.post('/api/login', user.login);

module.exports = router;