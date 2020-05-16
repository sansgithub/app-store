let express = require('express');
let router = express.Router();
const app = require('../controllers/app.controller');

router.get('/', app.show);

module.exports = router;