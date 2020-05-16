let express = require('express');
let router = express.Router();
const app = require('../controllers/app.controller');

router.post('/create-app', app.create);

module.exports = router;