let express = require('express');
let router = express.Router();
const app = require('../controllers/app.controller');
const auth = require('../middlewares/auth.middleware');

router.get('/api/apps', app.show);
router.post('/api/create-app', auth, app.create);
router.put('/api/edit/:id', auth, app.edit);
router.delete('/api/delete/:id', auth, app.delete);

module.exports = router;