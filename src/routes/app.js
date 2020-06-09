let express = require('express');
let router = express.Router();
const app = require('../controllers/app.controller');
const auth = require('../middlewares/auth.middleware');
var multer = require('multer');
const user = require('../controllers/user.controller');

const upload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'public/uploads/')
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname)
    }
  })
});

router.get('/api/apps', app.show);
router.get('/api/:user_id/apps', auth, app.showMyApps);
router.post('/api/create-app', auth, upload.fields([{ name: 'icon', maxCount: 1 }, { name: 'screenshots', maxCount: 4 }]), app.create);
router.put('/api/edit_app/:app_id', auth, app.edit);
router.delete('/api/delete_app/:app_id', auth, app.delete);
router.get('/api/search/:app_name', app.searchApp)

module.exports = router;